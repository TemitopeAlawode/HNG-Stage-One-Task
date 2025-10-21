import { createHash } from 'crypto';

export interface StringProperties {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: { [key: string]: number };
}


export function analyzeString(value: string): StringProperties {
    const length = value.length;
    const is_palindrome = value.toLowerCase() === value.toLowerCase().split('').reverse().join('');
    // Create a Set from the characters of the word.
    // The spread operator (...) converts the string into an array of characters.
    const unique_characters = new Set(value).size; // returns the number of (unique) elements in Set.
    // Removes extra spaces, splits the string into words, filters out empty entries,
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    // and counts the total number of words in the input string.
    const word_count = words.length;
    // Generates a SHA-256 hash of the input string and encodes it as a hexadecimal value for secure representation.
    const sha256_hash = createHash('sha256').update(value).digest('hex');
    // Creates a frequency map that counts how many times each character appears in the input string.
    const character_frequency_map: { [key: string]: number } = {};
    for (const char of value) {        
        // character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
         if (!/\s/.test(char)) { // Exclude all whitespace characters
        character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
        }
    }

    return {
        length,
        is_palindrome,
        unique_characters,
        word_count,
        sha256_hash,
        character_frequency_map
    };
}

// Test the function
// console.log(analyzeString("Keep it up"));

