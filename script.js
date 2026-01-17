document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const MAX_KEYWORDS = 6;
    const MAX_SUGGESTIONS = 3; 

    // Helper: Extract clean text from PDF
    async function getFileText(file) {
        if (file.type === "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(" ");
                fullText += pageText + "\n";
            }
            return fullText;
        } else {
            return await file.text();
        }
    }

    // --- CRITICAL FIX: Safe JSON Parse for Mistral ---
    function safeJSONParse(jsonString) {
        try {
            // Find the first { and last } to ignore "Here is your JSON" chatter
            const start = jsonString.indexOf('{');
            const end = jsonString.lastIndexOf('}');
            if (start === -1 || end === -1) throw new Error("No JSON found");
            
            const clean = jsonString.substring(start, end + 1).replace(/[\n\r\t]/g, ' '); 
            return JSON.parse(clean);
        } catch (e) {
            console.error("Parse failed for string:", jsonString);
            throw new Error("AI response was not in a valid format.");
        }
    }

    // --- MAIN ANALYSIS FUNCTION ---
    async function performRealAnalysis(jd, resumeFile) {
        const jdStatus = document.getElementById('jdStatus');
        const loadingContent = document.getElementById('loadingContent');
        const resultsContent = document.getElementById('resultsContent');
        const initialContent = document.getElementById('initialContent');
        
        // Defensive check for the Wrapper (fixes your classList error)
        const mainWrapper = document.getElementById('mainWrapper');

        try {
            jdStatus.textContent = "Reading PDF...";
            const resumeText = await getFileText(resumeFile);
            
            jdStatus.textContent = "Talking to AI...";
            
            // YOUR ORIGINAL PROMPT
            const promptContent = `You are an ATS Scanner. Compare the Resume to the Job Description. 
            Return a valid JSON object. Do not use Markdown or conversational text.
            
            Format:
            {
              "score": number,
              "missingKeywords": ["keyword1", "keyword2"],
              "suggestions": ["suggestion 1", "suggestion 2"]
            }

            JOB DESCRIPTION: ${jd}
            RESUME TEXT: ${resumeText}`;

            // --- CALLING YOUR LOCAL BACKEND ---
            const response = await fetch("https://hiremetrics-jmkn.onrender.com/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptContent })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Server Error ${response.status}`);
            }

            const data = await response.json();

            // Safety check for OpenRouter structure
            if (!data.choices || !data.choices[0]) {
                throw new Error("AI returned an empty response. Check backend logs.");
            }

            const result = safeJSONParse(data.choices[0].message.content);

            // --- UPDATE UI ---
            if (mainWrapper) {
                mainWrapper.classList.add('analyzed-state');
                mainWrapper.classList.remove('initial-state');
            }

            document.getElementById('atsScore').innerText = `${result.score}%`;
            
            const keywordList = document.getElementById('missingKeywords');
            keywordList.innerHTML = "";
            if(result.missingKeywords) {
                result.missingKeywords.slice(0, MAX_KEYWORDS).forEach(kw => {
                    const li = document.createElement('li');
                    li.innerText = kw;
                    keywordList.appendChild(li);
                });
            }

            const suggestionsContainer = document.getElementById('suggestionsText');
            suggestionsContainer.innerHTML = "";
            if(result.suggestions) {
                result.suggestions.slice(0, MAX_SUGGESTIONS).forEach(tip => {
                    const li = document.createElement('li');
                    li.innerHTML = tip.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                    suggestionsContainer.appendChild(li);
                });
            }

            jdStatus.textContent = "Analysis Complete";
            loadingContent.classList.add('hidden');
            resultsContent.classList.remove('hidden');

        } catch (error) {
            console.error("Error:", error);
            alert(`Analysis Failed: ${error.message}`);
            jdStatus.textContent = "Error";
            loadingContent.classList.add('hidden');
            initialContent.classList.remove('hidden');
        }
    }

    // --- EVENT LISTENERS ---
    document.getElementById('analyzeBtn').addEventListener('click', function() {
    const jd = document.getElementById('jdInput').value;
    const resume = document.getElementById('resumeInput').files[0];

    if (!jd || !resume) {
        alert("Please provide both a Job Description and a Resume.");
        return;
    }

    // --- ADD THESE RESET LINES ---
    document.getElementById('atsScore').innerText = "0%"; // Reset score
    document.getElementById('missingKeywords').innerHTML = ""; // Clear old keywords
    document.getElementById('suggestionsText').innerHTML = ""; // Clear old suggestions
    // -----------------------------

    document.getElementById('initialContent').classList.add('hidden');
    document.getElementById('resultsContent').classList.add('hidden'); // Ensure results are hidden
    document.getElementById('loadingContent').classList.remove('hidden'); // Show loader

    performRealAnalysis(jd, resume);
});

    // Character Count & Clear
    document.getElementById('jdInput').addEventListener('input', (e) => {
        document.getElementById('charCount').textContent = `${e.target.value.length} / 5000 characters`;
    });

    document.getElementById('clearJd').addEventListener('click', () => {
        document.getElementById('jdInput').value = "";
    });
});