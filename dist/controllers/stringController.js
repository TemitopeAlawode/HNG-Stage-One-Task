"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringsHandler = exports.naturalLanguageFilterHandler = exports.deleteStringHandler = exports.getFilteredStringsHandler = exports.getStringHandler = exports.createStringHandler = void 0;
const stringService_1 = require("../services/stringService");
const String_1 = __importDefault(require("../models/String"));
const naturalLanguageParser_1 = require("../utils/naturalLanguageParser");
// ================================================
// @desc   Create/Analyze String
// @route  POST  /strings
// @access Public
// ================================================
const createStringHandler = async (req, res) => {
    const { value } = req.body;
    if (typeof value !== 'string') {
        res.status(422).json({ message: 'Invalid data type for "value" (must be string)' });
        return;
    }
    if (!value) {
        res.status(400).json({ message: 'Missing "value" field' });
        return;
    }
    try {
        const result = await (0, stringService_1.createString)(value);
        res.status(201).json(result);
    }
    catch (error) {
        if (error.message === 'String already exists') {
            res.status(409).json({ message: error.message });
        }
        else {
            res.status(409).json({ message: 'Internal Server Error' });
        }
    }
};
exports.createStringHandler = createStringHandler;
// ================================================
// @desc   Get Specific String
// @route  GET  /strings/:string_value
// @access Public
// ================================================
const getStringHandler = async (req, res) => {
    const { string_value } = req.params;
    console.log('Handling GET /strings/:string_value', req.params);
    const result = await (0, stringService_1.getStringByValue)(string_value);
    if (!result) {
        res.status(404).json({ message: 'String not found' });
        return;
    }
    res.status(200).json(result);
};
exports.getStringHandler = getStringHandler;
// ================================================
// @desc   Get all Strings with Filtering
// @route  GET  /strings?is_palindrome=value&min_length=value&max_length=value&word_count=value&contains_character=value
// @access Public
// ================================================
const getFilteredStringsHandler = async (req, res) => {
    // Extract query parameters
    const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;
    try {
        // Gradually fill this filters object only with the parameters that the user actually sent.
        const filters = {};
        // Convert and assign values properly
        if (is_palindrome) {
            filters.is_palindrome = is_palindrome === 'true';
        }
        if (min_length) {
            filters.min_length = parseInt(min_length);
        }
        if (max_length) {
            filters.max_length = parseInt(max_length);
        }
        if (word_count) {
            filters.word_count = parseInt(word_count);
        }
        if (contains_character) {
            filters.contains_character = contains_character;
        }
        // This checks if any of the parsed numbers turned into NaN (which means the input wasn’t a valid number).
        // If that happens, it returns a 400 Bad Request with an error message instead of continuing.
        if (Object.values(filters).some(v => Number.isNaN(v))) {
            res.status(400).json({ error: 'Invalid query parameter values or types' });
            return;
        }
        const result = await (0, stringService_1.getFilteredStrings)(filters);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid query parameter values or types' });
    }
};
exports.getFilteredStringsHandler = getFilteredStringsHandler;
// ================================================
// @descDelete String
// @route  DELETE  /strings/:string_value
// @access Public
// ================================================
const deleteStringHandler = async (req, res) => {
    const { string_value } = req.params;
    const deleted = await (0, stringService_1.deleteString)(string_value);
    if (!deleted) {
        res.status(404).json({ message: 'String does not exist in the system' });
    }
    res.status(204).send();
};
exports.deleteStringHandler = deleteStringHandler;
// ================================================
// @desc Natural Language Filtering
// @route  GET  /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings
// @access Public
// ================================================
const naturalLanguageFilterHandler = async (req, res) => {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Missing or invalid query parameter' });
        return;
    }
    try {
        // It calls the parser in the utils folder.
        // Then passes the extracted filters into your getFilteredStrings() function, which fetches from the database.
        const parsedFilters = (0, naturalLanguageParser_1.parseNaturalLanguageQuery)(query);
        const result = await (0, stringService_1.getFilteredStrings)(parsedFilters);
        res.status(200).json({
            data: result.data,
            count: result.count,
            interpreted_query: {
                original: query,
                parsed_filters: parsedFilters,
            },
        });
    }
    catch (error) {
        if (error.message === 'Invalid filters') {
            res.status(422).json({ message: 'Query parsed but resulted in conflicting filters' });
        }
        else {
            res.status(400).json({ message: 'Unable to parse natural language query' });
        }
    }
};
exports.naturalLanguageFilterHandler = naturalLanguageFilterHandler;
// ================================================
// @desc   Get all Strings
// @route  GET  /strings
// @access Public
// ================================================
const getStringsHandler = async (req, res) => {
    const hasFilters = Object.keys(req.query).length > 0;
    if (hasFilters) {
        return (0, exports.getFilteredStringsHandler)(req, res); // call filtering logic
    }
    // Otherwise, return all strings
    try {
        const strings = await String_1.default.findAll();
        res.status(200).json(strings);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.getStringsHandler = getStringsHandler;
