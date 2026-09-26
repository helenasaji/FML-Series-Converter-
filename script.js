// --- COMPLETE FML MAPPING DICTIONARIES ---

// 1. Vowels (സ്വരങ്ങൾ)
const vowels = {
    "അ": "A", "ആ": "B", "ഇ": "C", "ഈ": "D", "ഉ": "E", 
    "ഊ": "F", "ഋ": "G", "എ": "H", "ഏ": "I", "ഐ": "J", 
    "ഒ": "K", "ഓ": "L", "ഔ": "M", "അം": "Aw", "അഃ": "AX"
};

// 2. Base Consonants (വ്യഞ്ജനങ്ങൾ)
const consonants = {
    "ക": "k", "ഖ": "K", "ഗ": "g", "ഘ": "G", "ങ": "W",
    "ച": "c", "ഛ": "C", "ജ": "j", "ഝ": "J", "ഞ": "O",
    "ട": "t", "ഠ": "T", "ഡ": "d", "ഢ": "D", "ണ": "N",
    "ത": "q", "ഥ": "Q", "ദ": "x", "ധ": "X", "ന": "n",
    "പ": "p", "ഫ": "P", "ബ": "b", "ഭ": "B", "മ": "m",
    "യ": "y", "ര": "r", "ല": "l", "വ": "v", "ശ": "S",
    "ഷ": "z", "സ": "s", "ഹ": "h", "ള": "L", "ഴ": "Z", "റ": "R"
};

// 3. Chillu Letters (ചില്ലക്ഷരങ്ങൾ)
const chillus = {
    "ൽ": "Â", "ൾ": "Ã", "ൺ": "Ä", "ൻ": "Å", "ർ": "º"
};

// 4. Common Conjuncts (കൂട്ടക്ഷരങ്ങൾ)
const conjuncts = {
    "ക്ക": "¡", "ക്ഷ": "£", "ക്ല": "¢", "ക്വ": "¤", 
    "ങ്ങ": "§", "ങ്ക": "¦", "ച്ച": "©", "ഞ്ച": "ª", 
    "ട്ട": "«", "ണ്ട": "¬", "ണ്ണ": "®", "ത്ത": "¯", 
    "ദ്ദ": "°", "ദ്ധ": "±", "ന്ത": "²", "ന്ദ": "³", 
    "ന്ന": "´", "പ്പ": "µ", "മ്പ": "¶", "മ്മ": "·", 
    "യ്യ": "¸", "ല്ല": "¹", "വ്വ": "º", "ശ്ശ": "»", 
    "സ്സ": "¼", "ള്ള": "½", "റ്റ": "¾"
};

// 5. Left-Side Vowel Signs (Must swap to appear before consonant)
const leftVowels = {
    "െ": "s", 
    "േ": "S", 
    "ൈ": "ss" 
};

// 6. Right-Side & Bottom Vowel Signs
const rightVowels = {
    "ാ": "a", "ി": "i", "ീ": "I", "ു": "u", "ൂ": "U", 
    "ൃ": "f", "ൊ": "sa", "ോ": "Sa", "ൌ": "O", "ൗ": "O",
    "്": "v"  
};

// 7. Special Modifiers
const modifiers = {
    "്യ": "y",  
    "്ര": "r",  
    "്വ": "v",  
    "ം": "w",   
    "ഃ": "X"    
};


// --- CONVERSION LOGIC ---

function convertToFML(unicodeText) {
    let result = unicodeText;

    // Step 1: Replace multi-character Conjuncts first
    for (let [uni, fml] of Object.entries(conjuncts)) {
        let regex = new RegExp(uni, "g");
        result = result.replace(regex, fml);
    }

    // Step 2: Handle Left-side vowels (Swap logic)
    const allBaseKeys = [...Object.keys(consonants), ...Object.keys(conjuncts)].join("|");
    const leftVowelRegex = new RegExp(`(${allBaseKeys})(െ|േ|ൈ)`, "g");
    
    result = result.replace(leftVowelRegex, function(match, baseChar, vowel) {
        let fmlVowel = leftVowels[vowel];
        let fmlBase = consonants[baseChar] || conjuncts[baseChar];
        return fmlVowel + fmlBase; 
    });

    // Step 3: Replace Chillus, Vowels, Modifiers, and Right Vowels
    const directReplacements = { 
        ...chillus, 
        ...vowels, 
        ...rightVowels, 
        ...modifiers 
    };

    for (let [uni, fml] of Object.entries(directReplacements)) {
        let regex = new RegExp(uni, "g");
        result = result.replace(regex, fml);
    }

    // Step 4: Replace remaining standalone Consonants
    for (let [uni, fml] of Object.entries(consonants)) {
        let regex = new RegExp(uni, "g");
        result = result.replace(regex, fml);
    }

    return result;
}


// --- DOM MANIPULATION & EVENT LISTENERS ---

const inputArea = document.getElementById('unicodeInput');
const outputArea = document.getElementById('fmlOutput');
const copyBtn = document.getElementById('copyBtn');

// Listen for typing and convert instantly
inputArea.addEventListener('input', () => {
    const rawText = inputArea.value;
    const convertedText = convertToFML(rawText);
    outputArea.value = convertedText;
});

// Copy button functionality
copyBtn.addEventListener('click', () => {
    if (!outputArea.value) return; // Prevent copying empty text
    
    // Modern Clipboard API
    navigator.clipboard.writeText(outputArea.value).then(() => {
        // Visual feedback
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        copyBtn.style.backgroundColor = '#27ae60'; // Change to green
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = '#3498db'; // Revert to blue
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});
