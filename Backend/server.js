// server.js
// This is the main entry point for our application.

import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Make sure env variables are loaded
import sequelize, { connectDB } from './config/db.js';
import organizationRoutes from './routes/organizations.js';
import userRoutes from './routes/users.js';

// Import models to sync them
import './models/organization.js';
import './models/user.js';

// --- INITIALIZE EXPRESS APP ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);

// --- ROOT ENDPOINT ---
app.get('/', (req, res) => {
  res.send('B2B Management API (SQL) is up and running!');
});

// --- START THE SERVER ---
const startServer = async () => {
  try {
    // 1. Test the database connection
    await connectDB();
    
    // 2. Sync models with the database
    // This creates tables if they don't exist
    // Use { alter: true } in dev to update tables, but be careful in prod.
    await sequelize.sync(); 
    console.log("All models were synchronized successfully.");
    
    // 3. Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export default app;