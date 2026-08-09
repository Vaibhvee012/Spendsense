const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBudget, getBudgets, deleteBudget } = require('../controllers/budgetController');

router.use(protect);

router.route('/').post(createBudget).get(getBudgets);
router.route('/:id').delete(deleteBudget);

module.exports = router;