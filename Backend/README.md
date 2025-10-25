B2B Dashboard Backend:

Project Structure

Here is the full directory layout for your project:

    b2b-dashboard-backend/
    ├── config/
    │   └── db.js             # Database connection (Sequelize)
    ├── models/
    │   ├── organization.js   # Organization model and associations
    │   └── user.js           # User model and associations
    ├── routes/
    │   ├── organizations.js  # API routes for /api/organizations
    │   └── users.js          # API routes for /api/users
    ├── .env                  # Environment variables (DB credentials)
    ├── package.json          # Project dependencies
    └── server.js             # Main Express server file

Here is the complete code for each file.

1. /.env

This file stores your secret database credentials. Do not commit this file to Git.

# .env
# Store your SQL database connection details here.
# Make sure you have a PostgreSQL database created named 'b2b-dashboard'.
# Adjust these values for your local PostgreSQL setup.
DB_DIALECT="postgres"
DB_HOST="localhost"
DB_USER="your_postgres_user"
DB_PASSWORD="your_postgres_password"
DB_NAME="b2b-dashboard"
DB_PORT="5432"


2. /package.json

This file defines your project's dependencies and scripts.

{
  "name": "b2b-dashboard-backend",
  "version": "1.0.0",
  "description": "Backend server for the B2B Organizations Management Dashboard.",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "nodejs",
    "express",
    "api",
    "b2b",
    "sql",
    "sequelize",
    "postgres"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "sequelize": "^6.35.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}


3. /server.js

This is the main entry point for your application. It initializes Express, connects to the database, syncs the models, and starts the server.

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


4. /config/db.js

This file configures and exports your Sequelize database connection.

// config/db.js
import { Sequelize } from 'sequelize';
import 'dotenv/config'; // Loads variables from .env into process.env

// Initialize Sequelize with connection parameters from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false, // Set to console.log to see SQL queries
  }
);

// Function to test the connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

// Export the sequelize instance to be used in models
export default sequelize;


5. /models/organization.js

Defines the Organization model (table) using Sequelize.

// models/organization.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  contact: { type: DataTypes.STRING },
  pendingRequests: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Blocked'),
    defaultValue: 'Active'
  },
  
  // From "Organization details"
  primaryAdminName: { type: DataTypes.STRING },
  supportEmail: { type: DataTypes.STRING },
  maxCoordinators: { type: DataTypes.INTEGER },
  timezone: { type: DataTypes.STRING },
  language: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  primaryAdminEmail: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  altPhone: { type: DataTypes.STRING }
  
  // `users` association will be defined in the User model
}, {
  timestamps: true // Adds createdAt and updatedAt columns
});

export default Organization;


6. /models/user.js

Defines the User model and sets up the all-important associations between User and Organization.

// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Organization from './organization.js'; // Import Organization to create the association

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Co-ordinator'),
    allowNull: false
  }
  // The 'organizationId' foreign key will be added by the association
}, {
  timestamps: true
});

// --- DEFINE ASSOCIATIONS ---

// One-to-Many: Organization has many Users
Organization.hasMany(User, {
  foreignKey: 'organizationId', // This will add 'organizationId' to the User model
  as: 'users' // This alias is for querying (e.g., org.getUsers())
});

// Many-to-One: User belongs to one Organization
User.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization' // This alias is for querying (e.g., user.getOrganization())
});

export default User;


7. /routes/organizations.js

This file defines all the API endpoints for managing organizations (e.g., GET, POST, PUT).

// routes/organizations.js
// This file defines all API endpoints related to organizations.

import express from 'express';
import Organization from '../models/organization.js';
import User from '../models/user.js'; // We need this to create new users

const router = express.Router();

// --- ROUTES ---

// GET /api/organizations
// Get a list of all organizations for the main dashboard view.
router.get('/', async (req, res) => {
  try {
    // Find all orgs, but only select the fields needed for the summary list
    const summaryList = await Organization.findAll({
      attributes: ['id', 'name', 'pendingRequests', 'status']
    });
    res.json(summaryList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/organizations/:id
// Get detailed information for a single organization, and include its user list.
router.get('/:id', async (req, res) => {
  try {
    // Find the org by its Primary Key (id) and use `include` to join users
    const org = await Organization.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'users' // This 'as' must match the association alias
      }
    });
    
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/organizations
// Add a new organization from the "Add Organization" modal.
router.post('/', async (req, res) => {
  try {
    const { name, slug } = req.body;
    const newOrganization = await Organization.create({
      ...req.body,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-')
    });
    res.status(201).json(newOrganization);
  } catch (err) {
    // Handle validation errors (e.g., unique constraint)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email or slug already in use.' });
    }
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/organizations/:id
// Update an existing organization's details.
router.put('/:id', async (req, res) => {
  try {
    const [rowsUpdated, [updatedOrg]] = await Organization.update(req.body, {
      where: { id: req.params.id },
      returning: true // Returns the updated row
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(updatedOrg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/organizations/:id/users
// Get the list of users for a specific organization.
router.get('/:id/users', async (req, res) => {
    try {
        const org = await Organization.findByPk(req.params.id, {
          include: { model: User, as: 'users' }
        });
        if (!org) {
            return res.status(440).json({ message: 'Organization not found' });
        }
        res.json(org.users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/organizations/:id/users
// Add a new user to a specific organization (from the "Add User" modal).
router.post('/:id/users', async (req, res) => {
    try {
        const { name, role } = req.body;
        const orgId = req.params.id;

        // 1. Check if the parent organization exists
        const organization = await Organization.findByPk(orgId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // 2. Create the new user, automatically associating it
        const newUser = await User.create({
            name,
            role,
            organizationId: orgId // Sequelize automatically links them
        });

        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;


8. /routes/users.js

This file defines all the API endpoints for managing users globally (e.g., GET all users, DELETE a user).

// routes/users.js
// This file defines API endpoints for global user management.

import express from 'express';
import User from '../models/user.js';
import Organization from '../models/organization.js';

const router = express.Router();

// GET /api/users
// Get a list of ALL users in the system
router.get('/', async (req, res) => {
  try {
    // Find all users and include their 'organization' data
    const users = await User.findAll({
      include: {
        model: Organization,
        as: 'organization',
        attributes: ['name'] // Only include the organization's name
      }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id
// Get a single user by their ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: { model: Organization, as: 'organization' }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id
// Update a user's details (e.g., change their name or role)
router.put('/:id', async (req, res) => {
  try {
    const [rowsUpdated, [updatedUser]] = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/users/:id
// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    // Deleting a user will automatically remove them from their organization
    // thanks to the database association (foreign key).
    const rowsDeleted = await User.destroy({
      where: { id: req.params.id }
    });
    
    if (rowsDeleted === 0) {
       return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

