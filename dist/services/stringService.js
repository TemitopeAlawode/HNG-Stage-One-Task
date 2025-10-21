"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createString = createString;
exports.getStringByValue = getStringByValue;
exports.getFilteredStrings = getFilteredStrings;
exports.deleteString = deleteString;
// Importing the model
const crypto_1 = require("crypto");
const String_1 = __importDefault(require("../models/String"));
const stringAnalyzer_1 = require("../utils/stringAnalyzer");
const sequelize_1 = require("sequelize");
// ========================>>>>>>>>>
// Create/Analyze String
// ========================>>>>>>>>>
async function createString(value) {
    const properties = (0, stringAnalyzer_1.analyzeString)(value);
    const existing = await String_1.default.findByPk(properties.sha256_hash);
    if (existing) {
        throw new Error('String already exists');
    }
    const result = await String_1.default.create({
        id: properties.sha256_hash,
        value,
        properties,
        created_at: new Date().toISOString()
    });
    return result.toJSON();
}
// ========================>>>>>>>>>
// Get Specific String
// ========================>>>>>>>>>
async function getStringByValue(value) {
    const properties = (0, stringAnalyzer_1.analyzeString)(value);
    const hash = properties.sha256_hash;
    // const hash = createHash('sha256').update(value).digest('hex');
    const result = await String_1.default.findByPk(hash);
    return result ? result.toJSON() : null;
}
// ========================>>>>>>>>>
// Get All Strings with Filtering
// ========================>>>>>>>>>
async function getFilteredStrings(filters) {
    // Initializes an empty where object to build the Sequelize query conditions dynamically
    const where = {};
    //  Filtering through all the string properties to check which one matches the filter
    if (filters.is_palindrome !== undefined) {
        where['properties.is_palindrome'] = filters.is_palindrome;
    }
    // If min_length is provided, adds a condition to filter records where the length property is greater than or equal to (Op.gte) the specified value.
    if (filters.min_length) {
        where['properties.length'] = { [sequelize_1.Op.gte]: filters.min_length };
    }
    // If max_length is provided, adds a condition for less than or equal to (Op.lte).
    // Uses the spread operator (...) to merge with any existing properties.length conditions (e.g., from min_length), allowing both min_length and max_length to coexist in the query 
    // (e.g., length >= 5 AND length <= 10).
    if (filters.max_length) {
        where['properties.length'] = { ...where['properties.length'], [sequelize_1.Op.lte]: filters.max_length };
    }
    if (filters.word_count) {
        where['properties.word_count'] = filters.word_count;
    }
    // If contains_character is provided, adds a condition to filter records where the value column (the raw string) contains the specified character, using SQL’s LIKE operator with wildcards (%).
    if (filters.contains_character) {
        where.value = { [sequelize_1.Op.like]: `%${filters.contains_character}%` };
    }
    // Uses Sequelize’s findAndCountAll to query the StringModel table with the constructed where conditions.
    const result = await String_1.default.findAndCountAll({ where });
    return {
        data: result.rows.map(row => row.toJSON()),
        count: result.count,
        filters_applied: filters
    };
}
// ========================>>>>>>>>>
// Delete String
// ========================>>>>>>>>>
async function deleteString(value) {
    const hash = (0, crypto_1.createHash)('sha256').update(value).digest('hex');
    const deleted = await String_1.default.destroy({ where: { id: hash } });
    return deleted > 0;
    // We want to return a boolean that clearly tells whether the delete operation succeeded.
    // If it finds a record that matches { id: hash }, it deletes it and returns 1.
    // If no record matches, it returns 0.
}
