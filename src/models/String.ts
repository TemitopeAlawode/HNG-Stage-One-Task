// Importing necessary Sequelize dependencies: DataTypes for defining column types,
// Model for creating the model class, and ModelStatic for typing model constructors.
import { DataTypes, Model, ModelStatic } from 'sequelize';
// Importing the configured Sequelize instance for database connection.
import sequelize from '../db';

import { StringProperties } from "../utils/stringAnalyzer";

// Defining the StringAttributes interface to specify the shape of the String model's attributes.
// This ensures type safety for the model's fields and their expected values.
interface StringAttributes {
    id?: string;
    value: string;
    properties: StringProperties; 
    created_at: string;
}

// Defining the StringInstance interface, which extends Sequelize's Model class and StringAttributes.
// This combines Sequelize's model functionality with the custom attributes for type-safe instances.
interface StringInstance extends Model<StringAttributes>, StringAttributes { }


// Defining the String model using sequelize.define, specifying the model name, attributes, and options.
// The generic type StringInstance ensures type safety for the model's instances.
const String = sequelize.define<StringInstance>(
    'String',
    {
        // Defining the model's attributes (columns) with their data types, constraints, and validations.
    id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  properties: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
    },
    {
        timestamps: false // Automatically removes the createdAt and updatedAt columns to track record creation/update times.
    }
);


// Exporting the String model for use in other parts of the application.
export default String;