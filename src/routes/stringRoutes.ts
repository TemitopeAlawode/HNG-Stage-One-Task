import express from 'express';  // Importing express

// Importing APIs handlers (Controllers)
import { 
    createStringHandler, 
    getStringHandler, 
    getFilteredStringsHandler,
    deleteStringHandler,
    naturalLanguageFilterHandler,
    getStringsHandler
 } from "../controllers/stringController";


// Initialize router
const router = express.Router();


router.post('', createStringHandler);
router.get('/filter-by-natural-language', naturalLanguageFilterHandler);
router.get('/:string_value', getStringHandler);
router.get('', getFilteredStringsHandler);
router.delete('/:string_value', deleteStringHandler);
router.get('', getStringsHandler);



export default router;