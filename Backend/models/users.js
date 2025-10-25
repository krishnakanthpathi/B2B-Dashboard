// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Organization from './organizations.js';

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