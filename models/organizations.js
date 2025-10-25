// models/organizations.js
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
  img : { type: DataTypes.STRING },
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