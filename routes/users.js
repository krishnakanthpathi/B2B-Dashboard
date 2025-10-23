// routes/users.js
// This file defines API endpoints for global user management.

import express from 'express';
import User from '../models/users.js';
import Organization from '../models/organizations.js';

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