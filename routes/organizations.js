// routes/organizations.js
// This file defines all API endpoints related to organizations.

import express from 'express';

const router = express.Router();

// --- ROUTES ---
import { get_all } from '../controllers/organizations.js';
import { get_id } from '../controllers/organizations.js';
import { create } from '../controllers/organizations.js';
import { update } from '../controllers/organizations.js';
import { remove } from '../controllers/organizations.js';


import { get_users_all } from '../controllers/organizations.js';
import { create_user } from '../controllers/organizations.js';

// GET /api/organizations
// Get a list of all organizations for the main dashboard view.
router.get('/', get_all);

// GET /api/organizations/:id
// Get detailed information for a single organization, and include its user list.
router.get('/:id', get_id);

// POST /api/organizations
// Add a new organization from the "Add Organization" modal.
router.post('/', create); 

// PUT /api/organizations/:id
// Update an existing organization's details.
router.put('/:id', update);

// GET /api/organizations/:id/users
// Get the list of users for a specific organization.
router.get('/:id/users', get_users_all);

// POST /api/organizations/:id/users
// Add a new user to a specific organization (from the "Add User" modal).
router.post('/:id/users', create_user);

// DELETE /api/organizations/:id
// Delete an organization by its ID.
router.delete('/:id', remove);

export default router;
