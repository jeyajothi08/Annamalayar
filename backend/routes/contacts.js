import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact message/enquiry
router.post('/', async (req, res) => {
  const { name, phone, vehicle, message } = req.body;

  // Basic Validation
  if (!name || !phone || !vehicle || !message) {
    return res.status(400).json({ message: 'All contact fields are required.' });
  }

  try {
    // Insert into db
    await pool.query(
      'INSERT INTO contact_messages (name, phone, vehicle, message) VALUES (?, ?, ?, ?)',
      [name, phone, vehicle, message]
    );

    res.status(201).json({
      message: 'Your enquiry has been submitted. Our team will contact you shortly!'
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Server error while logging message.' });
  }
});

export default router;
