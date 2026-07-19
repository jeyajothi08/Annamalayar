import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Query admin user
    const [admins] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
    if (admins.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const admin = admins[0];

    // Verify Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token with isAdmin = true
    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // shorter expiry for admin session
    );

    res.json({
      message: 'Admin authentication successful!',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login.' });
  }
});

// @route   GET /api/admin/reviews
// @desc    Get all reviews (pending and approved)
router.get('/reviews', verifyAdmin, async (req, res) => {
  try {
    const [reviews] = await pool.query(
      `SELECT r.id, r.rating, r.vehicle_model, r.review_text, r.photo_path, r.is_approved, r.is_verified, r.created_at, u.name as customer_name, u.email as customer_email
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json({ reviews });
  } catch (error) {
    console.error('Admin fetch reviews error:', error);
    res.status(500).json({ message: 'Server error retrieving reviews.' });
  }
});

// @route   PUT /api/admin/reviews/:id/approve
// @desc    Approve a pending review
router.put('/reviews/:id/approve', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('UPDATE reviews SET is_approved = 1 WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.json({ message: 'Review approved and published successfully.' });
  } catch (error) {
    console.error('Admin review approval error:', error);
    res.status(500).json({ message: 'Server error approving review.' });
  }
});

// @route   PUT /api/admin/reviews/:id/reject
// @desc    Reject/unapprove a review
router.put('/reviews/:id/reject', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('UPDATE reviews SET is_approved = 0 WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.json({ message: 'Review status set to pending.' });
  } catch (error) {
    console.error('Admin review rejection error:', error);
    res.status(500).json({ message: 'Server error rejecting review.' });
  }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete a review completely
router.delete('/reviews/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    // Optionally delete the associated image file from uploads folder if path exists
    const [review] = await pool.query('SELECT photo_path FROM reviews WHERE id = ?', [id]);
    if (review.length > 0 && review[0].photo_path) {
      const filename = path.basename(review[0].photo_path);
      const filePath = path.join('uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Admin review delete error:', error);
    res.status(500).json({ message: 'Server error deleting review.' });
  }
});

// @route   GET /api/admin/users
// @desc    Get list of all registered customers
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, is_verified, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (error) {
    console.error('Admin fetch users error:', error);
    res.status(500).json({ message: 'Server error retrieving users.' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user account and their reviews (via cascade constraint)
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User account not found.' });
    }
    res.json({ message: 'Customer account deleted successfully.' });
  } catch (error) {
    console.error('Admin user delete error:', error);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contact messages (enquiries)
router.get('/contacts', verifyAdmin, async (req, res) => {
  try {
    const [messages] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ messages });
  } catch (error) {
    console.error('Admin fetch contacts error:', error);
    res.status(500).json({ message: 'Server error retrieving contact enquiries.' });
  }
});

// @route   DELETE /api/admin/contacts/:id
// @desc    Delete a specific contact message
router.delete('/contacts/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enquiry message not found.' });
    }
    res.json({ message: 'Enquiry log entry deleted successfully.' });
  } catch (error) {
    console.error('Admin contact delete error:', error);
    res.status(500).json({ message: 'Server error deleting enquiry log.' });
  }
});

export default router;
