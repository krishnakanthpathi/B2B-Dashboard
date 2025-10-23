// server.js
// This is the main entry point for our application.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// --- IMPORT ROUTES ---
import organizationRoutes from './routes/organizations.js';

dotenv.config();

// --- INITIALIZE EXPRESS APP ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
// // Import and use the routes defined in separate files for better organization.
app.use('/api/organizations', organizationRoutes);
// app.use('/api/users', userRoutes);

// --- ROOT ENDPOINT ---
app.get('/', (req, res) => {
  res.json('B2B Management API is up and running!');
});

// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

