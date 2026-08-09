const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  runRecurringCheck,
  exportTransactions,
  importTransactions,
} = require('../controllers/transactionController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(protect);

router.post('/process-recurring', runRecurringCheck);
router.get('/export', exportTransactions);
router.post('/import', upload.single('file'), importTransactions);

router.route('/').post(createTransaction).get(getTransactions);
router.route('/:id').get(getTransactionById).put(updateTransaction).delete(deleteTransaction);

module.exports = router;