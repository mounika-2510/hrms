const express = require('express');
const router = express.Router();
const { listLogs } = require('../controllers/logController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', listLogs);

module.exports = router;