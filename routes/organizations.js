// routes/organizations.js
// This file defines all API endpoints related to organizations.

import express from 'express';
const router = express.Router();

// --- IN-MEMORY DATABASE (for demonstration) ---
// In a real application, this data would be stored in a database like MongoDB, PostgreSQL, etc.
let organizations = [
  {
    id: 1,
    name: 'Massachusetts Institute of Technology',
    email: 'contact@mit.edu',
    slug: 'mit',
    contact: '+1-617-253-1000',
    pendingRequests: 45,
    status: 'Active',
    // Detailed properties from the "Organization details" screen
    primaryAdminName: 'Taylor Jones',
    supportEmail: 'support@mit.edu',
    maxCoordinators: 5,
    timezone: 'America/New_York',
    language: 'English',
    website: 'mit.edu',
    primaryAdminEmail: 'taylor.j@mit.edu',
    phone: '+16172531000',
    region: 'America/New_York',
    altPhone: '+16172531001',
    users: [
        { id: 101, name: 'Dave Richards', role: 'Admin', organizationId: 1 },
        { id: 102, name: 'Abhishek Hari', role: 'Co-ordinator', organizationId: 1 },
    ]
  },
  {
    id: 2,
    name: 'GITAM Institute of Technology',
    email: 'gitam@gitam.in',
    slug: 'gitam',
    contact: '+91-9676456543',
    pendingRequests: 23,
    status: 'Inactive',
    primaryAdminName: 'Nishta Gupta',
    supportEmail: 'help@gitam.com',
    maxCoordinators: 10,
    timezone: 'Asia/Kolkata',
    language: 'English',
    website: 'gitam.edu',
    primaryAdminEmail: 'nishta.g@gitam.in',
    phone: '+919676456543',
    region: 'Asia/Colombo',
    altPhone: '',
    users: [
        { id: 103, name: 'Nishta Gupta', role: 'Admin', organizationId: 2 }
    ]
  },
  {
    id: 3,
    name: 'Zoroboro Inc.',
    email: 'hello@zoroboro.com',
    slug: 'zoroboro',
    contact: '+1-555-123-4567',
    pendingRequests: 12,
    status: 'Blocked',
    primaryAdminName: 'Jane Doe',
    supportEmail: 'support@zoroboro.com',
    maxCoordinators: 3,
    timezone: 'Europe/London',
    language: 'English',
    website: 'zoroboro.com',
    primaryAdminEmail: 'jane.d@zoroboro.com',
    phone: '+15551234567',
    region: 'Europe/London',
    altPhone: '',
    users: []
  },
];

// --- ROUTES ---

// GET /api/organizations
// Get a list of all organizations for the main dashboard view.
router.get('/', (req, res) => {
  // We only send the summary data needed for the main list.
  const summaryList = organizations.map(org => ({
    id: org.id,
    name: org.name,
    pendingRequests: org.pendingRequests,
    status: org.status
  }));
  res.json(summaryList);
});

// GET /api/organizations/:id
// Get detailed information for a single organization.
router.get('/:id', (req, res) => {
  const org = organizations.find(o => o.id === parseInt(req.params.id));
  if (!org) {
    return res.status(440).json({ message: 'Organization not found' });
  }
  res.json(org);
});

// POST /api/organizations
// Add a new organization from the "Add Organization" modal.
router.post('/', (req, res) => {
  const { name, email, slug, contact } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  const newOrganization = {
    id: Date.now(), // Use a timestamp for a unique ID
    name,
    email,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    contact,
    pendingRequests: 0,
    status: 'Active',
    users: []
    // Add other default details here
  };

  organizations.push(newOrganization);
  res.status(201).json(newOrganization);
});

// PUT /api/organizations/:id
// Update an existing organization's details.
router.put('/:id', (req, res) => {
    const orgId = parseInt(req.params.id);
    const orgIndex = organizations.findIndex(o => o.id === orgId);

    if (orgIndex === -1) {
        return res.status(404).json({ message: 'Organization not found' });
    }

    // Merge existing data with new data from request body
    const updatedOrg = { ...organizations[orgIndex], ...req.body };
    organizations[orgIndex] = updatedOrg;

    res.json(updatedOrg);
});

// GET /api/organizations/:id/users
// Get the list of users for a specific organization.
router.get('/:id/users', (req, res) => {
    const org = organizations.find(o => o.id === parseInt(req.params.id));
    if (!org) {
        return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(org.users || []);
});


export default router;

