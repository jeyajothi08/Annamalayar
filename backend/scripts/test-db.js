import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testConnection() {
  console.log('🔍 Starting database self-test...');
  console.log(`Connecting to: Host="${process.env.DB_HOST || 'localhost'}", User="${process.env.DB_USER || 'root'}", DB="${process.env.DB_NAME || 'annamalaiyar_towing'}"`);

  let connection;
  try {
    // 1. Initial connection without database first to check if server is reachable
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ MySQL Server is reachable.');
    
    // 2. Check if the database exists
    const [dbRows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME || 'annamalaiyar_towing'}'`);
    if (dbRows.length === 0) {
      console.log(`⚠️ Database "${process.env.DB_NAME || 'annamalaiyar_towing'}" does not exist.`);
      console.log('Attempting to initialize the database from schema.sql...');

      const sqlPath = path.join(__dirname, '../../database/schema.sql');
      if (fs.existsSync(sqlPath)) {
        const schemaSql = fs.readFileSync(sqlPath, 'utf8');
        // split multiple queries by semicolon (excluding comments)
        const queries = schemaSql
          .split(/;\s*$/m)
          .map(q => q.trim())
          .filter(q => q.length > 0);

        for (const query of queries) {
          await connection.query(query);
        }
        console.log('✅ Database created and schemas imported successfully.');
      } else {
        console.log(`❌ schema.sql file not found at ${sqlPath}. Please import it manually.`);
      }
    } else {
      console.log(`✅ Database "${process.env.DB_NAME || 'annamalaiyar_towing'}" exists.`);
      
      // Select database
      await connection.query(`USE ${process.env.DB_NAME || 'annamalaiyar_towing'}`);

      // Check tables
      const [tableRows] = await connection.query('SHOW TABLES');
      const tables = tableRows.map(row => Object.values(row)[0]);
      console.log('Found tables in database:', tables);
      
      const requiredTables = ['users', 'admin', 'reviews', 'contact_messages'];
      const missing = requiredTables.filter(t => !tables.includes(t));
      
      if (missing.length > 0) {
        console.log(`⚠️ Missing tables: ${missing.join(', ')}. Please rerun database/schema.sql.`);
      } else {
        console.log('✅ All required database tables are active and matching.');
      }
    }

  } catch (error) {
    console.error('❌ Connection test failed with error:');
    console.error(error.message);
    console.log('\n💡 Please check if MySQL is running locally and credentials in backend/.env are correct.');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();
