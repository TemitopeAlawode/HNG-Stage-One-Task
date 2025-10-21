"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNaturalLanguageQuery = parseNaturalLanguageQuery;
// This is the parser - it analyzes the English sentence and extracts meaningful filters.
function parseNaturalLanguageQuery(query) {
    // It first creates an empty object filters that will hold extracted filter criteria.
    const filters = {};
    // Then it converts the input to lowercase to make matching easier
    const lowerQuery = query.toLowerCase();
    // Detecting 'palindromic' - If the text mentions "palindromic", it sets a filter for palindromes.
    if (lowerQuery.includes('palindromic')) {
        filters.is_palindrome = true;
    }
    // Detecting 'single word' - If the text says "single word", it sets word_count = 1
    if (lowerQuery.includes('single word')) {
        filters.word_count = 1;
    }
    // Detecting "longer than X"
    const longerThanMatch = lowerQuery.match(/longer than (\d+)/);
    if (longerThanMatch) {
        filters.min_length = parseInt(longerThanMatch[1]) + 1;
    }
    // e.g "show me strings longer than 5"
    // the .match() method will return an array
    // The first element ("longer than 5") is the whole match.
    // The second element ("5") is the captured number, because of the parentheses ()
    // Then we add 1, because:
    // “longer than 5” means the minimum valid length is 6.
    // Detecting "shorter than X"
    const shorterThanMatch = lowerQuery.match(/shorter than (\d+)/);
    if (shorterThanMatch) {
        filters.max_length = parseInt(shorterThanMatch[1]) - 1;
    }
    // Detecting "containing the letter X" - This captures the letter mentioned in the phrase.
    // Example: "containing the letter g": contains_character = 'g'
    const containsLetterMatch = lowerQuery.match(/containing the letter (\w)/);
    if (containsLetterMatch) {
        filters.contains_character = containsLetterMatch[1];
    }
    // Detecting "first vowel"
    if (lowerQuery.includes('first vowel')) {
        filters.contains_character = 'a';
    }
    // Validations
    //  filters.min_length > filters.max_length
    // This checks if the minimum value is greater than the maximum value.
    // That’s a logical error, because:
    // You can’t have a range where the minimum is greater than the maximum.
    if (filters.min_length && filters.max_length && filters.min_length > filters.max_length) {
        throw new Error('Invalid filters');
    }
    if (Object.keys(filters).length === 0) {
        throw new Error('Unable to parse query');
    }
    return filters;
}
