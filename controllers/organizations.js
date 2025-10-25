import Organization from '../models/organizations.js';
import User from '../models/users.js';

// Get a list of all organizations for the main dashboard view.
// Get all or one organization depending on query
const get_all = async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      // If id is passed as query param, return that specific organization
      const org = await Organization.findByPk(id);
      if (!org) {
        return res.status(404).json({ message: 'Organization not found' });
      }
      return res.json(org);
    }

    // Otherwise, return all organizations
    const summaryList = await Organization.findAll({
      attributes: ['id', 'name', 'pendingRequests', 'status']
    });

    res.json(summaryList);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get detailed information for a single organization, and include its user list.
const get_id = async (req, res) => {
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
};

// Add a new organization from the "Add Organization" modal.
const create =  async (req, res) => {
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
}

// Update an existing organization's details.
const update = async (req, res) => {
  try {
    const id = req.params.id;

    // Update the organization
    const [rowsUpdated] = await Organization.update(req.body, {
      where: { id }
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Fetch the updated record
    const updatedOrg = await Organization.findByPk(id);
    res.json(updatedOrg);

  } catch (err) {
    console.error("Error updating organization:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete an organization 
const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const rowsDeleted = await Organization.destroy({
      where: { id }
    });

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ message: 'Organization deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get the list of users for a specific organization.
const get_users_all = async (req, res) => {
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
}   

// Add a new user to a specific organization (from the "Add User" modal).
const create_user = async (req, res) => {
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
}

export { get_all , get_id , create , update, get_users_all , create_user , remove};