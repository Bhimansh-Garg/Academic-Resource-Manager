const pool = require('../config/db');
const path = require('path');

// Multer doesn't insert to DB, we do it here after multer saves the file
exports.uploadResource = async (req, res) => {
  try {
    const { title, subject_id } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No valid file provided or invalid file type' });
    }

    if (!title || !subject_id) {
      return res.status(400).json({ message: 'Title and subject_id are required' });
    }

    const file_url = `/uploads/${req.file.filename}`;
    const uploaded_by = req.user.id;

    // Insert into DB
    const result = await pool.query(
      `INSERT INTO resources (title, file_url, subject_id, uploaded_by, verification_status, version)
       VALUES ($1, $2, $3, $4, 'pending', 1) RETURNING id, title, file_url, verification_status`,
      [title, file_url, subject_id, uploaded_by]
    );

    res.status(201).json({
      message: 'Uploaded successfully',
      resource: result.rows[0]
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

exports.getResources = async (req, res) => {
  try {
    const { subject_id, semester, keyword, status, uploaded_by } = req.query;

    let queryText = `
      SELECT 
        r.id, 
        r.title, 
        r.file_url, 
        r.verification_status, 
        r.version, 
        r.download_count, 
        r.created_at,
        u.name AS uploaded_by_name,
        s.name AS subject_name,
        s.semester,
        d.name AS department_name
      FROM resources r
      JOIN users u ON r.uploaded_by = u.id
      JOIN subjects s ON r.subject_id = s.id
      JOIN departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    if (subject_id) {
      queryText += ` AND r.subject_id = $${paramIndex}`;
      queryParams.push(subject_id);
      paramIndex++;
    }

    if (semester) {
      queryText += ` AND s.semester = $${paramIndex}`;
      queryParams.push(semester);
      paramIndex++;
    }

    if (keyword) {
      queryText += ` AND r.title ILIKE $${paramIndex}`;
      queryParams.push(`%${keyword}%`);
      paramIndex++;
    }

    if (status) {
      queryText += ` AND r.verification_status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }
    
    // For "My Uploads" page
    if (uploaded_by === 'me') {
      queryText += ` AND r.uploaded_by = $${paramIndex}`;
      queryParams.push(req.user.id);
      paramIndex++;
    }

    queryText += ` ORDER BY r.created_at DESC`;

    const result = await pool.query(queryText, queryParams);
    res.json(result.rows);

  } catch (error) {
    console.error('List Resources Error:', error);
    res.status(500).json({ message: 'Server error fetching resources' });
  }
};

exports.downloadResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    
    // Get the resource info to find the file
    const result = await pool.query('SELECT file_url FROM resources WHERE id = $1', [resourceId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment download count
    await pool.query('UPDATE resources SET download_count = download_count + 1 WHERE id = $1', [resourceId]);
    
    // Send standard static file path url (client can route to it or handle redirection)
    // We can redirect the API to the static path so the browser initiates a download
    const fileUrl = result.rows[0].file_url;
    res.redirect(fileUrl);
    
  } catch (error) {
    console.error('Download Resource Error:', error);
    res.status(500).json({ message: 'Server error downloading resource' });
  }
};
