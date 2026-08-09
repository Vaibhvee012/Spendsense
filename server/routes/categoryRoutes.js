const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.use(protect);

router.route('/').post(createCategory).get(getCategories);
router.route('/:id').put(updateCategory).delete(deleteCategory);

module.exports = router;