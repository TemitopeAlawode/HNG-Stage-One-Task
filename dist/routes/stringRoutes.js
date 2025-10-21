"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importing express
// Importing APIs handlers (Controllers)
const stringController_1 = require("../controllers/stringController");
// Initialize router
const router = express_1.default.Router();
router.post('', stringController_1.createStringHandler);
router.get('/filter-by-natural-language', stringController_1.naturalLanguageFilterHandler);
router.get('/:string_value', stringController_1.getStringHandler);
router.get('', stringController_1.getFilteredStringsHandler);
router.delete('/:string_value', stringController_1.deleteStringHandler);
router.get('', stringController_1.getStringsHandler);
exports.default = router;
