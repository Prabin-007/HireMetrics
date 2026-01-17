require('dotenv').config(); // Load the .env file
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DEBUG CHECK: This will tell you in the terminal if the key loaded
if (!process.env.OPENROUTER_KEY) {
    console.error("❌ ERROR: OPENROUTER_KEY is missing from .env file!");
} else {
    console.log("✅ API Key detected in .env");
}

app.post('/api/analyze', async (req, res) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_KEY.trim()}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "HireMetrics"
            },
            body: JSON.stringify({
                "model": "mistralai/mistral-small-creative", 
                "messages": [{ "role": "user", "content": req.body.prompt }]
            })
        });

        const data = await response.json();
        
        // Final "User Not Found" Fix:
        // If data.error exists, OpenRouter is telling us why it failed
        if (data.error) {
            console.error("OpenRouter Error:", data.error);
            return res.status(data.error.code || 400).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error("Server Crash:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => console.log("Backend running at http://localhost:3000"));