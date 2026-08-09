const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createGoal, getGoals, contributeToGoal, deleteGoal } = require('../controllers/goalController');

router.use(protect);

router.route('/').post(createGoal).get(getGoals);
router.route('/:id').delete(deleteGoal);
router.post('/:id/contribute', contributeToGoal);

module.exports = router;