const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMonthlySummary, getInsights, getTrend } = require('../controllers/analyticsController');

router.use(protect);

router.get('/summary', getMonthlySummary);
router.get('/insights', getInsights);
router.get('/trend', getTrend);

module.exports = router;