import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure mock database directory and files exist
const mockDir = path.join(__dirname, '../mock-data');
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

const USERS_FILE = path.join(mockDir, 'users.json');
const REVIEWS_FILE = path.join(mockDir, 'reviews.json');
const CONTACTS_FILE = path.join(mockDir, 'contact_messages.json');
const ADMIN_FILE = path.join(mockDir, 'admin.json');

const initFile = (filePath, defaultData = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initFile(USERS_FILE, []);
initFile(CONTACTS_FILE, []);
initFile(ADMIN_FILE, [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$xK71.5sI2gPzH90P71yU9.W4w.W6w/6B8eJ8uH7t7f/Q8yM9f2zH2', // Admin@123
    email: 'admin@annamalaiyartowing.com',
    created_at: new Date().toISOString()
  }
]);
initFile(REVIEWS_FILE, [
  {
    id: 1,
    user_id: 1,
    rating: 5,
    vehicle_model: "Maruti Swift",
    review_text: "I recently had the pleasure of using Annamalaiyar Recovery & Towing Service, and I must say, their service exceeded my expectations! The short wait time was impressive; they arrived promptly and handled my vehicle with great care. The staff was professional and friendly.",
    photo_path: null,
    is_approved: 1,
    is_verified: 1,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    user_id: 2,
    rating: 5,
    vehicle_model: "Hyundai i20",
    review_text: "I had a great experience with Annamalaiyar Recovery & Towing Service! They provided quick service when I needed help with my vehicle. The staff was friendly and professional, making everything easy for me. Plus, their prices were very reasonable.",
    photo_path: null,
    is_approved: 1,
    is_verified: 1,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
]);

// Helper to read and write mock JSON files
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeJSON = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Initialize MySQL pool variables
let realPool = null;
let dbConnected = false;

try {
  realPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'annamalaiyar_towing',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  // Attempt brief connection test
  const connection = await realPool.getConnection();
  dbConnected = true;
  console.log('✅ Connected to MySQL database successfully.');
  connection.release();
} catch (error) {
  console.warn('⚠️ Database connection failed. Local MySQL server is not running or credentials differ.');
  console.log('📂 Fallback Mode Activated: Using local file-based JSON database (backend/mock-data/).');
  dbConnected = false;
}

// JSON Fallback Mock Query Interpreter
const executeMockQuery = async (sql, params = []) => {
  const users = readJSON(USERS_FILE);
  const reviews = readJSON(REVIEWS_FILE);
  const contacts = readJSON(CONTACTS_FILE);
  const admins = readJSON(ADMIN_FILE);

  const cleanSql = sql.replace(/\s+/g, ' ').trim();

  // 1. Users Queries
  if (cleanSql.includes('SELECT id FROM users WHERE email = ?')) {
    const matched = users.filter(u => u.email === params[0]);
    return [matched, null];
  }

  if (cleanSql.includes('INSERT INTO users')) {
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: params[0],
      email: params[1],
      phone: params[2],
      password: params[3],
      reset_token: null,
      reset_token_expiry: null,
      is_verified: 0,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    writeJSON(USERS_FILE, users);
    return [{ insertId: newUser.id, affectedRows: 1 }, null];
  }

  if (cleanSql.includes('SELECT * FROM users WHERE email = ?')) {
    const matched = users.filter(u => u.email === params[0]);
    return [matched, null];
  }

  if (cleanSql.includes('SELECT id, name, email, phone, is_verified FROM users WHERE id = ?')) {
    const matched = users.filter(u => u.id === params[0]);
    return [matched, null];
  }

  if (cleanSql.includes('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?')) {
    const userIndex = users.findIndex(u => u.email === params[2]);
    if (userIndex !== -1) {
      users[userIndex].reset_token = params[0];
      users[userIndex].reset_token_expiry = params[1];
      writeJSON(USERS_FILE, users);
    }
    return [{ affectedRows: 1 }, null];
  }

  if (cleanSql.includes('SELECT id, reset_token, reset_token_expiry FROM users WHERE email = ?')) {
    const matched = users.filter(u => u.email === params[0]).map(u => ({
      id: u.id,
      reset_token: u.reset_token,
      reset_token_expiry: u.reset_token_expiry
    }));
    return [matched, null];
  }

  if (cleanSql.includes('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?')) {
    const userIndex = users.findIndex(u => u.email === params[1]);
    if (userIndex !== -1) {
      users[userIndex].password = params[0];
      users[userIndex].reset_token = null;
      users[userIndex].reset_token_expiry = null;
      writeJSON(USERS_FILE, users);
    }
    return [{ affectedRows: 1 }, null];
  }

  // 2. Reviews Queries
  if (cleanSql.includes('SELECT COUNT(*) as total FROM reviews WHERE is_approved = 1')) {
    const total = reviews.filter(r => r.is_approved === 1).length;
    return [[{ total }], null];
  }

  if (cleanSql.includes('SELECT r.id, r.rating, r.vehicle_model, r.review_text, r.photo_path, r.is_verified, r.created_at, u.name as customer_name')) {
    const approvedReviews = reviews
      .filter(r => r.is_approved === 1)
      .map(r => {
        const creator = users.find(u => u.id === r.user_id) || { name: 'Verified Customer' };
        return {
          ...r,
          customer_name: r.customer_name || creator.name
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Slice pagination
    const limit = params[0] || 5;
    const offset = params[1] || 0;
    const paginated = approvedReviews.slice(offset, offset + limit);
    return [paginated, null];
  }

  if (cleanSql.includes('SELECT AVG(rating) as avgRating, COUNT(*) as totalCount FROM reviews WHERE is_approved = 1')) {
    const approved = reviews.filter(r => r.is_approved === 1);
    const count = approved.length;
    const avg = count > 0 ? approved.reduce((acc, r) => acc + r.rating, 0) / count : 0;
    return [[{ avgRating: avg, totalCount: count }], null];
  }

  if (cleanSql.includes('SELECT rating, COUNT(*) as count FROM reviews WHERE is_approved = 1 GROUP BY rating')) {
    const approved = reviews.filter(r => r.is_approved === 1);
    const breakdown = [1, 2, 3, 4, 5].map(star => {
      const starCount = approved.filter(r => r.rating === star).length;
      return { rating: star, count: starCount };
    });
    return [breakdown, null];
  }

  if (cleanSql.includes('INSERT INTO reviews (user_id, rating, vehicle_model, review_text, photo_path, is_approved, is_verified)')) {
    const newReview = {
      id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
      user_id: params[0],
      rating: params[1],
      vehicle_model: params[2],
      review_text: params[3],
      photo_path: params[4],
      is_approved: 0, // Pending moderation
      is_verified: 1,
      created_at: new Date().toISOString()
    };
    reviews.push(newReview);
    writeJSON(REVIEWS_FILE, reviews);
    return [{ insertId: newReview.id, affectedRows: 1 }, null];
  }

  // 3. Contact Enquiries Queries
  if (cleanSql.includes('INSERT INTO contact_messages (name, phone, vehicle, message)')) {
    const newEnquiry = {
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
      name: params[0],
      phone: params[1],
      vehicle: params[2],
      message: params[3],
      created_at: new Date().toISOString()
    };
    contacts.push(newEnquiry);
    writeJSON(CONTACTS_FILE, contacts);
    return [{ insertId: newEnquiry.id, affectedRows: 1 }, null];
  }

  // 4. Admin Queries
  if (cleanSql.includes('SELECT * FROM admin WHERE username = ?')) {
    const matched = admins.filter(a => a.username === params[0]);
    return [matched, null];
  }

  if (cleanSql.includes('SELECT r.id, r.rating, r.vehicle_model, r.review_text, r.photo_path, r.is_approved, r.is_verified, r.created_at, u.name as customer_name, u.email as customer_email FROM reviews')) {
    const mapped = reviews
      .map(r => {
        const creator = users.find(u => u.id === r.user_id) || { name: 'Verified Customer', email: 'verified@customer.com' };
        return {
          ...r,
          customer_name: r.customer_name || creator.name,
          customer_email: r.customer_email || creator.email
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [mapped, null];
  }

  if (cleanSql.includes('UPDATE reviews SET is_approved = 1 WHERE id = ?')) {
    const index = reviews.findIndex(r => r.id === parseInt(params[0]));
    if (index !== -1) {
      reviews[index].is_approved = 1;
      writeJSON(REVIEWS_FILE, reviews);
    }
    return [{ affectedRows: 1 }, null];
  }

  if (cleanSql.includes('UPDATE reviews SET is_approved = 0 WHERE id = ?')) {
    const index = reviews.findIndex(r => r.id === parseInt(params[0]));
    if (index !== -1) {
      reviews[index].is_approved = 0;
      writeJSON(REVIEWS_FILE, reviews);
    }
    return [{ affectedRows: 1 }, null];
  }

  if (cleanSql.includes('SELECT photo_path FROM reviews WHERE id = ?')) {
    const matched = reviews.filter(r => r.id === parseInt(params[0])).map(r => ({ photo_path: r.photo_path }));
    return [matched, null];
  }

  if (cleanSql.includes('DELETE FROM reviews WHERE id = ?')) {
    const index = reviews.findIndex(r => r.id === parseInt(params[0]));
    if (index !== -1) {
      reviews.splice(index, 1);
      writeJSON(REVIEWS_FILE, reviews);
    }
    return [{ affectedRows: 1 }, null];
  }

  if (cleanSql.includes('SELECT id, name, email, phone, is_verified, created_at FROM users')) {
    const sorted = users
      .map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, is_verified: u.is_verified, created_at: u.created_at }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [sorted, null];
  }

  if (cleanSql.includes('DELETE FROM users WHERE id = ?')) {
    const userId = parseInt(params[0]);
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users.splice(index, 1);
      writeJSON(USERS_FILE, users);
      
      // Cascade reviews removal
      const filteredReviews = reviews.filter(r => r.user_id !== userId);
      writeJSON(REVIEWS_FILE, filteredReviews);
    }
    return [{ affectedRows: 1 }, null];
  }

  if (cleanSql.includes('SELECT * FROM contact_messages ORDER BY created_at DESC')) {
    const sorted = contacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [sorted, null];
  }

  if (cleanSql.includes('DELETE FROM contact_messages WHERE id = ?')) {
    const index = contacts.findIndex(c => c.id === parseInt(params[0]));
    if (index !== -1) {
      contacts.splice(index, 1);
      writeJSON(CONTACTS_FILE, contacts);
    }
    return [{ affectedRows: 1 }, null];
  }

  console.log('⚠️ Warning: Mock query not explicitly handled:', cleanSql);
  return [[], null];
};

// Expose proxy wrapper to look identical to mysql2 Pool query signature
const pool = {
  async query(sql, params = []) {
    if (dbConnected && realPool) {
      try {
        return await realPool.query(sql, params);
      } catch (err) {
        console.warn('MySQL connection dropped mid-flight. Switching to local JSON mock database:', err.message);
        dbConnected = false;
      }
    }
    return await executeMockQuery(sql, params);
  },
  async getConnection() {
    if (dbConnected && realPool) {
      try {
        return await realPool.getConnection();
      } catch (err) {
        dbConnected = false;
      }
    }
    return {
      release() {}
    };
  }
};

export default pool;
