"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing necessary Sequelize dependencies: DataTypes for defining column types,
// Model for creating the model class, and ModelStatic for typing model constructors.
const sequelize_1 = require("sequelize");
// Importing the configured Sequelize instance for database connection.
const db_1 = __importDefault(require("../db"));
// Defining the String model using sequelize.define, specifying the model name, attributes, and options.
// The generic type StringInstance ensures type safety for the model's instances.
const String = db_1.default.define('String', {
    // Defining the model's attributes (columns) with their data types, constraints, and validations.
    id: {
        type: sequelize_1.DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    properties: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    timestamps: false // Automatically removes the createdAt and updatedAt columns to track record creation/update times.
});
// Exporting the String model for use in other parts of the application.
exports.default = String;
