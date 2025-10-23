// config/db.js
import { Sequelize } from 'sequelize';
import 'dotenv/config'; // Loads variables from .env into process.env

// --- !! NEW DEBUG LINE !! ---
// This will print the exact value of DB_SSL that your app is seeing.
console.log(`[DEBUG] config/db.js: DB_SSL value is: "${process.env.DB_SSL}" (Type: ${typeof process.env.DB_SSL})`);
// --- !! END DEBUG LINE !! ---

// Base options
const dbOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: false, // Set to console.log to see SQL queries
};

// Add SSL configuration if DB_SSL is set to 'true' in .env
if (process.env.DB_SSL === 'true') {
  console.log('[DEBUG] config/db.js: Adding SSL options to database connection.');
  dbOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false // This setting may be needed for some free providers
    }
  };
} else {
  console.log(`[DEBUG] config/db.js: NOT adding SSL options because DB_SSL is not 'true'.`);
}

// Initialize Sequelize with connection parameters from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  dbOptions
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
