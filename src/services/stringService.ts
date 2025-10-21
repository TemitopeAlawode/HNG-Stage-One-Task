// Importing the model
import { createHash } from "crypto";
import String from "../models/String";
import { analyzeString, StringProperties } from "../utils/stringAnalyzer";
import { Op } from "sequelize";

interface StoredString {
    id: string;
    value: string;
    properties: StringProperties;
    created_at: string;
}

// ========================>>>>>>>>>
// Create/Analyze String
// ========================>>>>>>>>>
export async function createString(value: string) {
    const properties = analyzeString(value);
    const existing = await String.findByPk(properties.sha256_hash);
    if (existing) {
        throw new Error('String already exists');
    }

    const result = await String.create({
        id: properties.sha256_hash,
        value,
        properties,
        created_at: new Date().toISOString()
    });

    return result.toJSON() as StoredString;
}


// ========================>>>>>>>>>
// Get Specific String
// ========================>>>>>>>>>
export async function getStringByValue(value: string) {
    const properties = analyzeString(value);
    const hash = properties.sha256_hash;
    // const hash = createHash('sha256').update(value).digest('hex');
    const result = await String.findByPk(hash);
    return result ? result.toJSON() as StoredString : null;
}


// ========================>>>>>>>>>
// Get All Strings with Filtering
// ========================>>>>>>>>>
export async function getFilteredStrings(filters: {
    is_palindrome: boolean
    min_length: number
    max_length: number
    word_count: number
    contains_character: string
}) {
    // Initializes an empty where object to build the Sequelize query conditions dynamically
    const where: any = {};
    //  Filtering through all the string properties to check which one matches the filter
    if (filters.is_palindrome !== undefined) {
        where['properties.is_palindrome'] = filters.is_palindrome;
    }
    // If min_length is provided, adds a condition to filter records where the length property is greater than or equal to (Op.gte) the specified value.
    if (filters.min_length) {
        where['properties.length'] = { [Op.gte]: filters.min_length }
    }
    // If max_length is provided, adds a condition for less than or equal to (Op.lte).
    // Uses the spread operator (...) to merge with any existing properties.length conditions (e.g., from min_length), allowing both min_length and max_length to coexist in the query 
    // (e.g., length >= 5 AND length <= 10).
    if (filters.max_length) {
        where['properties.length'] = { ...where['properties.length'], [Op.lte]: filters.max_length }
    }
    if (filters.word_count) {
        where['properties.word_count'] = filters.word_count;
    }
    // If contains_character is provided, adds a condition to filter records where the value column (the raw string) contains the specified character, using SQL’s LIKE operator with wildcards (%).
    if (filters.contains_character) {
        where.value = { [Op.like]: `%${filters.contains_character}%` }
    }

    // Uses Sequelize’s findAndCountAll to query the StringModel table with the constructed where conditions.
    const result = await String.findAndCountAll({ where });

    return {
        data: result.rows.map(row => row.toJSON() as StoredString),
        count: result.count,
        filters_applied: filters
    };
}


// ========================>>>>>>>>>
// Delete String
// ========================>>>>>>>>>
export async function deleteString(value: string) {
    const hash = createHash('sha256').update(value).digest('hex');
    const deleted = await String.destroy({ where: { id: hash } });
    return deleted > 0;
    // We want to return a boolean that clearly tells whether the delete operation succeeded.
    // If it finds a record that matches { id: hash }, it deletes it and returns 1.
    // If no record matches, it returns 0.
}