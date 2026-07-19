import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/db.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'vehicle-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File Type Validation
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, WEBP) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   GET /api/reviews
// @desc    Get paginated approved customer reviews (latest first)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    // Count total approved reviews
    const [countRows] = await pool.query('SELECT COUNT(*) as total FROM reviews WHERE is_approved = 1');
    const totalReviews = countRows[0].total;
    const totalPages = Math.ceil(totalReviews / limit);

    // Fetch review data (joining with users to get customer name)
    const [reviews] = await pool.query(
      `SELECT r.id, r.rating, r.vehicle_model, r.review_text, r.photo_path, r.is_verified, r.created_at, u.name as customer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.is_approved = 1
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.json({
      reviews,
      pagination: {
        totalReviews,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ message: 'Error retrieving customer reviews.' });
  }
});

// @route   GET /api/reviews/stats
// @desc    Get review statistics (average rating, count, breakdown)
router.get('/stats', async (req, res) => {
  try {
    // Get average rating and total counts
    const [statsRows] = await pool.query(
      'SELECT AVG(rating) as avgRating, COUNT(*) as totalCount FROM reviews WHERE is_approved = 1'
    );

    const avgRating = parseFloat(statsRows[0].avgRating) || 0;
    const totalCount = statsRows[0].totalCount;

    // Get breakdown of star counts (1 to 5)
    const [breakdownRows] = await pool.query(
      'SELECT rating, COUNT(*) as count FROM reviews WHERE is_approved = 1 GROUP BY rating'
    );

    const starsBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    breakdownRows.forEach(row => {
      starsBreakdown[row.rating] = row.count;
    });

    res.json({
      avgRating: Math.round(avgRating * 10) / 10,
      totalCount,
      starsBreakdown
    });
  } catch (error) {
    console.error('Fetch reviews stats error:', error);
    res.status(500).json({ message: 'Error fetching review metrics.' });
  }
});

// @route   POST /api/reviews
// @desc    Submit a review (requires user login, optional photo, is_approved defaults to 0)
router.post('/', verifyUser, upload.single('photo'), async (req, res) => {
  const { rating, vehicleModel, reviewText } = req.body;

  // Validation
  if (!rating || !vehicleModel || !reviewText) {
    return res.status(400).json({ message: 'Rating, vehicle model, and review text are required.' });
  }

  const ratingVal = parseInt(rating);
  if (ratingVal < 1 || ratingVal > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  try {
    // Check if user has already submitted a review (optional limit, let's allow multiple or let them review and show admin approved)
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    // Insert into db. is_approved is 0 (false) by default, requiring Admin review
    await pool.query(
      `INSERT INTO reviews (user_id, rating, vehicle_model, review_text, photo_path, is_approved, is_verified)
       VALUES (?, ?, ?, ?, ?, 0, 1)`,
      [req.user.id, ratingVal, vehicleModel, reviewText, photoPath]
    );

    res.status(201).json({
      message: 'Review submitted successfully! It is pending administrator approval before publication.'
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: 'Server error while submitting review.' });
  }
});

export default router;
