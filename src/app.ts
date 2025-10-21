// Importing express
import express from 'express';

// Importing dotenv to load env variables
import dotenv from 'dotenv';

// Loads .env file contents into process.env
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON requests (For communication using json in the server)
app.use(express.json());


// Importing Routes
import stringRoutes from './routes/stringRoutes';


// Routes
app.use('/strings', stringRoutes);

// Add a test route to confirm server is working
// app.get('/test', (req, res) => res.send('Server is running'));


// Export app
export default app;