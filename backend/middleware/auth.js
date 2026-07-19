import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Verify User JWT Token
export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in database
    const [rows] = await pool.query('SELECT id, name, email, phone, is_verified FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = rows[0]; // Attach user profile to request object
    next();
  } catch (error) {
    console.error('User auth verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Verify Admin JWT Token
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify token structure is for admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized. Admin access only.' });
    }

    // Verify admin exists in db
    const [rows] = await pool.query('SELECT id, username, email FROM admin WHERE id = ?', [decoded.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    req.admin = rows[0]; // Attach admin details to request
    next();
  } catch (error) {
    console.error('Admin auth verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired admin token.' });
  }
};
