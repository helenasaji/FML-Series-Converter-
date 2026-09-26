// --- EXACT FML MAPPING FROM REFERENCE ---

// 1. Vowels (സ്വരങ്ങൾ)
const vowels = {
    "അ": "A", "ആ": "B", "ഇ": "C", "ഈ": "Cu", "ഉ": "D", 
    "ഊ": "Du", "ഋ": "E", "എ": "F", "ഏ": "G", "ഐ": "sF", 
    "ഒ": "H", "ഓ": "Hm", "ഔ": "Hu", "അം": "Aw", "അഃ": "AX"
};

// 2. Base Consonants (വ്യഞ്ജനങ്ങൾ)
const consonants = {
    "ക": "I", "ഖ": "J", "ഗ": "K", "ഘ": "L", "ങ": "M",
    "ച": "N", "ഛ": "O", "ജ": "P", "ഝ": "Q", "ഞ": "R",
    "ട": "S", "ഠ": "T", "ഡ": "U", "ഢ": "V", "ണ": "W",
    "ത": "X", "ഥ": "Y", "ദ": "Z", "ധ": "[", "ന": "\\",
    "പ": "]", "ഫ": "^", "ബ": "_", "ഭ": "`", "മ": "a",
    "യ": "b", "ര": "c", "ല": "e", "വ": "h", "ശ": "i",
    "ഷ": "j", "സ": "k", "ഹ": "l", "ള": "f", "ഴ": "g", "റ": "d"
};

// 3. Chillu Letters (ചില്ലക്ഷരങ്ങൾ)
const chillus = {
    "ർ": "À", "ൽ": "Â", "ൾ": "Ä", "ൻ": "³", "ൺ": "¬", "ൿ": "ൿ"
};

// 4. Common Conjuncts (കൂട്ടക്ഷരങ്ങൾ)
// Added ല്ല, ക്ഷ, and ഹ്ന which appeared in your title translations
const conjuncts = {
    "ക്ക": "¡", "ച്ച": "¨", "ട്ട": "«", "ത്ത": "¯", "പ്പ": "¸",
    "മ്മ": "½", "യ്യ": "¿", "വ്വ": "Æ", "ങ്ക": "¦", "ഞ്ച": "©",
    "ണ്ട": "ï", "ന്ത": "´", "മ്പ": "¼", "ങ്ങ": "§", "ഞ്ഞ": "ª",
    "ണ്ണ": "®", "ന്ന": "¶", "ക്ല": "¢", 
    "ല്ല": "Ã", "ക്ഷ": "£", "ഹ്ന": "Ó"
};

// 5. Left-Side Signs (Must swap to appear BEFORE the consonant in FML)
const leftSigns = {
    "െ": "s", 
    "േ": "t", 
    "ൈ": "ss",
    "്ര": "{"  // The r-kara symbol (e.g. ക്ര -> {I)
};

// 6. Right-Side & Bottom Vowel Signs
const rightVowels = {
    "ാ": "m", "ി": "n", "ീ": "o", "ു": "p", "ൂ": "q", 
    "ൃ": "r", "ൗ": "u", "്": "v"  
};

// 7. Right-Side Modifiers
const modifiers = {
    "്യ": "y",  // e.g., ക്യ -> Iy
    "്വ": "z",  // e.g., ക്വ -> Iz
    "ം": "w",   
    "ഃ": "X"    
};


// --- CONVERSION LOGIC ---

function convertToFML(unicodeText) {
    let result = unicodeText;

    // Step 0: Pre-process split vowels (ൊ, ോ, ൌ)
    // We split them into their left and right components so the swap logic handles them perfectly
    result = result.replace(/ൊ/g, "ൊ"); // e.g., കൊ -> ക + െ + ാ
    result = result.replace(/ോ/g, "ോ"); // e.g., കോ -> ക + േ + ാ
    result = result.replace(/ൌ/g, "ൌ"); // e.g., കൌ -> ക + െ + ൗ

    // Step 1: Pre-process Unicode modifier combinations (്ര, ്യ, ്വ)
    result = result.replace(/്റ/g, "്ര"); // Handle alternative r-kara typing
    result = result.replace(/്ര/g, "്ര");
    result = result.replace(/്യ/g, "്യ");
    result = result.replace(/്വ/g, "്വ");

    // Step 2: Replace multi-character Conjuncts first (ക്ക, ങ്ങ, etc.)
    for (let [uni, fml] of Object.entries(conjuncts)) {
        let regex = new RegExp(uni, "g");
        result = result.replace(regex, fml);
    }

    // Step 3: Handle Left-side signs (െ, േ, ൈ, ്ര) - The Swap Logic
    // This finds a base consonant followed by a left-sign, and swaps their order for FML
    const allBaseKeys = [...Object.keys(consonants), ...Object.keys(conjuncts)].join("|");
    const leftSignRegex = new RegExp(`(${allBaseKeys})(െ|േ|ൈ|്ര)`, "g");
    
    result = result.replace(leftSignRegex, function(match, baseChar, sign) {
        let fmlSign = leftSigns[sign];
        let fmlBase = consonants[baseChar] || conjuncts[baseChar];
        return fmlSign + fmlBase; 
    });

    // Step 4: Replace Chillus, Vowels, Modifiers, and Right Vowels
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

    // Step 5: Replace remaining standalone Consonants
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
    if (!outputArea.value) return; 
    
    navigator.clipboard.writeText(outputArea.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        copyBtn.style.backgroundColor = '#27ae60'; 
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = '#3498db'; 
        }, 1500);
    });
});
