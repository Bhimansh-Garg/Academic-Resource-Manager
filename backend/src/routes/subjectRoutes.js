const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const subjectController = require('../controllers/subjectController');

router.get('/', authMiddleware, subjectController.getSubjects);

module.exports = router;
