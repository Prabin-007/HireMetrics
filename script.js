document.addEventListener("DOMContentLoaded", () => {
   document.getElementById('analyzeBtn').addEventListener('click', function() {
    const jd = document.getElementById('jdInput').value;
    const resume = document.getElementById('resumeInput').files[0];

    if (!jd || !resume) {
        alert("Please provide both a Job Description and a Resume.");
        return;
    }

    // 1. Hide initial text, show results
    document.getElementById('initialContent').classList.add('hidden');
    document.getElementById('resultsContent').classList.remove('hidden');

    // 2. Mock Analysis (In a real app, you'd send data to an API here)
    performMockAnalysis();
});

function performMockAnalysis() {
    // Simulated Data
    const mockScore = 78;
    const mockKeywords = ["Python", "AWS", "Agile Methodology", "System Design"];
    const mockSuggestions = "Your resume is strong in technical skills, but consider adding more 'action verbs' like 'Spearheaded' or 'Optimized' to your experience section.";

    // Update UI
    document.getElementById('atsScore').innerText = `${mockScore}%`;
    
    const keywordList = document.getElementById('missingKeywords');
    keywordList.innerHTML = ""; // Clear old
    mockKeywords.forEach(kw => {
        const li = document.createElement('li');
        li.innerText = kw;
        keywordList.appendChild(li);
    });

    document.getElementById('suggestionsText').innerText = mockSuggestions;
}
const jdInput = document.getElementById('jdInput');
const charCount = document.getElementById('charCount');
const clearBtn = document.getElementById('clearJd');
const jdStatus = document.getElementById('jdStatus');

// Update character count and status
jdInput.addEventListener('input', () => {
    const length = jdInput.value.length;
    charCount.textContent = `${length} / 5000 characters`;

    if (length > 100) {
        jdStatus.textContent = "Analyzing Content...";
        jdStatus.style.color = "#4f46e5"; // Primary color
    } else if (length === 0) {
        jdStatus.textContent = "Empty";
        jdStatus.style.color = "#64748b";
    }
});

// Clear button logic
clearBtn.addEventListener('click', () => {
    jdInput.value = "";
    charCount.textContent = "0 / 5000 characters";
    jdStatus.textContent = "Ready";
    jdStatus.style.color = "#10b981";
});
    
});
