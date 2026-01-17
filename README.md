# HireMetrics 🚀  
**AI-Powered Resume ATS Optimizer**

HireMetrics is a web-based application that analyzes a resume against a job description and provides an **ATS (Applicant Tracking System) match score**, **missing keywords**, and **actionable suggestions** to improve resume alignment.

This project was built by a team of three friends during a hackathon with the goal of helping job seekers better optimize their resumes for modern hiring systems.

---

## ✨ Features

- 📄 Upload resume (PDF / DOC / DOCX)
- 📝 Paste job description
- 🤖 AI-powered ATS analysis
- 📊 ATS match score (percentage)
- ❌ Missing keyword identification
- 💡 Resume improvement suggestions
- ⏳ Real-time loading & feedback
- 📱 Fully responsive UI

---

## 🧠 How It Works

1. User pastes the **Job Description**
2. User uploads their **Resume**
3. Resume text is extracted using **PDF.js**
4. The backend AI model compares the resume with the job description
5. The system returns:
   - ATS Match Score
   - Missing keywords
   - Suggestions to improve resume relevance

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- PDF.js

### Backend
- Node.js
- Express.js

### AI / NLP
- Large Language Model (via OpenRouter / LLM API)

### Deployment
- Render

---

## 📁 Project Structure

HireMetrics/<br>
│<br>
├── index.html # Main frontend UI<br>
├── style.css # Styling and responsive design<br>
├── script.js # Frontend logic and API calls<br>
├── server.js # Backend server & AI integration<br>
├── package.json<br>
├── package-lock.json<br>
├── .env_sample # Environment variable template<br>
├── .gitignore<br>


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
git clone [https://github.com/Prabin-007/HireMetrics]<br>
cd HireMetrics

### Install Dependencies
npm install

### Create a .env file using .env_sample as reference.
OPENROUTER_API_KEY=your_api_key_here<br>
PORT=3000

### Start the Backend Server
node server.js

### Run the Frontend
Open index.html using Live Server or directly in your browser.

🚧 Known Limitations

ATS scoring is heuristic-based and not company-specific<br>
Resume formatting/design is not analyzed<br>
Large resumes may take longer to process<br>

🌱 Future Improvements

Keyword highlighting inside resume text<br>
Section-wise resume feedback<br>
Multiple job description comparison<br>
Resume export suggestions<br>
User authentication & history tracking<br>

👨‍💻 Team

Built with ❤️ by team AlgoKnights during the Caculo Innovation Hackathon.
