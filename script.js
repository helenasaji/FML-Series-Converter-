// --- Dictionary Maps (Expand these with full FML mappings) ---

const conjuncts = {
    "ക്ക": "¡", // Example placeholder
    "ച്ച": "¢"  // Example placeholder
};

// Left-side vowels (െ, േ, ൈ)
const leftVowels = {
    "െ": "s", 
    "േ": "S",
    "ൈ": "ss"
};

// Base consonants
const consonants = {
    "ക": "A",
    "ച": "a",
    "ട": "B"
};

// --- Conversion Logic ---
function convertToFML(unicodeText) {
    let result = unicodeText;

    // 1. Replace 3-part conjuncts first
    for (let [uni, fml] of Object.entries(conjuncts)) {
        let regex = new RegExp(uni, "g");
        result = result.replace(regex, fml);
    }

    // 2. Handle left-side vowels (Swap position to: Vowel + Consonant)
    const consonantKeys = Object.keys(consonants).join("|");
    const vowelRegex = new RegExp(`(${consonantKeys})(െ|േ|ൈ)`, "g");
    
    result = result.replace(vowelRegex, function(match, p1, p2) {
        let fmlVowel = leftVowels[p2];
        let fmlConsonant = consonants[p1];
        return fmlVowel + fmlConsonant; 
    });

    // 3. Replace remaining single consonants
    for (let [uni, fml] of Object.entries(consonants)) {
        let regex = new RegExp(uni, "g");
        result = result.replace(regex, fml);
    }

    return result;
}

// --- DOM Manipulation and Event Listeners ---

const inputArea = document.getElementById('unicodeInput');
const outputArea = document.getElementById('fmlOutput');
const copyBtn = document.getElementById('copyBtn');

// Trigger conversion instantly on every keystroke
inputArea.addEventListener('input', () => {
    const rawText = inputArea.value;
    const convertedText = convertToFML(rawText);
    outputArea.value = convertedText;
});

// Copy button functionality with brief visual feedback
copyBtn.addEventListener('click', () => {
    outputArea.select();
    document.execCommand('copy'); // Fallback for older browser compatibility
    // Modern clipboard API alternative: navigator.clipboard.writeText(outputArea.value);
    
    // Temporarily change button text to indicate success
    const originalText = copyBtn.innerText;
    copyBtn.innerText = 'Copied!';
    copyBtn.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.backgroundColor = '#3498db';
    }, 1500);
});
               
