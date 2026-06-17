const Groq = require('groq-sdk');
const pool = require('../config/db');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateComplaintLetter = async (req, res) => {
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

    const issue = result.rows[0];

    const authorityMap = {
      'Pothole': 'The Commissioner, BBMP Roads and Infrastructure Department',
      'Garbage': 'The Commissioner, BBMP Solid Waste Management Department',
      'Water Leakage': 'The Chief Engineer, Bangalore Water Supply and Sewerage Board (BWSSB)',
      'Streetlight': 'The Commissioner, BBMP Electrical Department',
      'Sewage': 'The Chief Engineer, BWSSB',
      'Other': 'The Commissioner, BBMP'
    };

    const authority = authorityMap[issue.category] || authorityMap['Other'];

    const prompt = `Write a formal complaint letter to ${authority} about the following civic issue:
Issue Type: ${issue.category}
Title: ${issue.title}
Description: ${issue.description}
Severity: ${issue.severity}
Reported By: ${issue.reporter_name}
Date: ${new Date().toLocaleDateString('en-IN')}

Write a professional formal letter requesting immediate action. No placeholders.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    const letter = completion.choices[0].message.content;

    res.json({
      message: 'Complaint letter generated successfully',
      letter,
      authority
    });

  } catch (error) {
    console.error('Groq error:', error);
    res.status(500).json({ message: 'Failed to generate letter', error: error.message });
  }
};

module.exports = { generateComplaintLetter };