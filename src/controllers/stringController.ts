// Importing req and res from express
import { Request, Response } from 'express';

import { createString, deleteString, getFilteredStrings, getStringByValue } from '../services/stringService';

import String from "../models/String";
import { parseNaturalLanguageQuery } from '../utils/naturalLanguageParser';



// ================================================
// @desc   Create/Analyze String
// @route  POST  /strings
// @access Public
// ================================================
export const createStringHandler = async (req: Request, res: Response) => {
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
    const result = await createString(value);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'String already exists') {
      res.status(409).json({ message: error.message });
    }
    else {
      res.status(409).json({ message: 'Internal Server Error' });
    }
  }
}


// ================================================
// @desc   Get Specific String
// @route  GET  /strings/:string_value
// @access Public
// ================================================
export const getStringHandler = async (req: Request, res: Response) => {
  const { string_value } = req.params;
  console.log('Handling GET /strings/:string_value', req.params);

  const result = await getStringByValue(string_value);
  if (!result) {
    res.status(404).json({ message: 'String not found' });
    return;
  }
  res.status(200).json(result);
}


// ================================================
// @desc   Get all Strings with Filtering
// @route  GET  /strings?is_palindrome=value&min_length=value&max_length=value&word_count=value&contains_character=value
// @access Public
// ================================================
export const getFilteredStringsHandler = async (req: Request, res: Response) => {
  // Extract query parameters
  const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;
  try {
    // Gradually fill this filters object only with the parameters that the user actually sent.
    const filters: any = {};
    // Convert and assign values properly
    if (is_palindrome) {
      filters.is_palindrome = is_palindrome === 'true';
    }
    if (min_length) {
      filters.min_length = parseInt(min_length as string);
    }
    if (max_length) {
      filters.max_length = parseInt(max_length as string);
    }
    if (word_count) {
      filters.word_count = parseInt(word_count as string);
    }
    if (contains_character) {
      filters.contains_character = contains_character as string;
    }

    // This checks if any of the parsed numbers turned into NaN (which means the input wasn’t a valid number).
    // If that happens, it returns a 400 Bad Request with an error message instead of continuing.
    if (Object.values(filters).some(v => Number.isNaN(v))) {
      res.status(400).json({ error: 'Invalid query parameter values or types' });
      return;
    }

    const result = await getFilteredStrings(filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Invalid query parameter values or types' });
  }
}


// ================================================
// @descDelete String
// @route  DELETE  /strings/:string_value
// @access Public
// ================================================
export const deleteStringHandler = async (req: Request, res: Response) => {
  const { string_value } = req.params;
  const deleted = await deleteString(string_value);
  if (!deleted) {
    res.status(404).json({ message: 'String does not exist in the system' });
  }

  res.status(204).send();
}


// ================================================
// @desc Natural Language Filtering
// @route  GET  /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings
// @access Public
// ================================================
export const naturalLanguageFilterHandler = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    res.status(400).json({ message: 'Missing or invalid query parameter' });
    return;
  }
  try {
    // It calls the parser in the utils folder.
    // Then passes the extracted filters into your getFilteredStrings() function, which fetches from the database.
    const parsedFilters = parseNaturalLanguageQuery(query);
    const result = await getFilteredStrings(parsedFilters);

    res.status(200).json({
      data: result.data,
      count: result.count,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    });
  } catch (error: any) {
    if (error.message === 'Invalid filters') {
      res.status(422).json({ message: 'Query parsed but resulted in conflicting filters' });
    } else {
      res.status(400).json({ message: 'Unable to parse natural language query' });
    }
  }
}




// ================================================
// @desc   Get all Strings
// @route  GET  /strings
// @access Public
// ================================================
export const getStringsHandler = async (req: Request, res: Response) => {
  const hasFilters = Object.keys(req.query).length > 0;
  if (hasFilters) {
    return getFilteredStringsHandler(req, res); // call filtering logic
  }

  // Otherwise, return all strings
  try {
    const strings = await String.findAll();
    res.status(200).json(strings);
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message
    })
  }
}
