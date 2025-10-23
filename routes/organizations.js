// routes/organizations.js
// This file defines all API endpoints related to organizations.

import express from 'express';
import Organization from '../models/organizations.js';
import User from '../models/users.js'; // We need this to create new users

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
            return res.status(404).json({ message: 'Organization not found' });
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
