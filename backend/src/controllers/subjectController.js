const pool = require('../config/db');

exports.getSubjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.name, s.semester, s.department_id, d.name AS department_name
      FROM subjects s
      JOIN departments d ON s.department_id = d.id
      ORDER BY s.semester ASC, s.name ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('List Subjects Error:', error);
    res.status(500).json({ message: 'Server error fetching subjects' });
  }
};
