
const pool = require('../config/db');
const cloudinary = require('../config/cloudinary');

// REPORT A NEW ISSUE
const reportIssue = async (req, res) => {
  try {
    const { title, description, category, severity, latitude, longitude } = req.body;
    const user_id = req.user.user_id;

    let image_url = null;

    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bugmap',
      });
      image_url = result.secure_url;
    }

    // Save issue to database
    const newIssue = await pool.query(
      `INSERT INTO issues 
        (user_id, title, description, category, severity, latitude, longitude, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [user_id, title, description, category, severity, latitude, longitude, image_url]
    );

    res.status(201).json({
      message: 'Issue reported successfully',
      issue: newIssue.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL ISSUES (for the map)
const getAllIssues = async (req, res) => {
  try {
    const issues = await pool.query(
      `SELECT i.*, u.name as reporter_name 
       FROM issues i
       JOIN users u ON i.user_id = u.user_id
       ORDER BY i.created_at DESC`
    );

    res.json({ issues: issues.rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET SINGLE ISSUE
const getIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT i.*, u.name as reporter_name 
       FROM issues i
       JOIN users u ON i.user_id = u.user_id
       WHERE i.issue_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({ issue: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPVOTE AN ISSUE
const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    // Check if already upvoted
    const existing = await pool.query(
      'SELECT * FROM upvotes WHERE user_id = $1 AND issue_id = $2',
      [user_id, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already upvoted this issue' });
    }

    // Add upvote
    await pool.query(
      'INSERT INTO upvotes (user_id, issue_id) VALUES ($1, $2)',
      [user_id, id]
    );

    // Increment upvote count
    await pool.query(
      'UPDATE issues SET upvote_count = upvote_count + 1 WHERE issue_id = $1',
      [id]
    );

    res.json({ message: 'Upvoted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE ISSUE STATUS (authority/admin)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await pool.query(
      'UPDATE issues SET status = $1 WHERE issue_id = $2',
      [status, id]
    );

    res.json({ message: 'Status updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { reportIssue, getAllIssues, getIssue, upvoteIssue, updateStatus };