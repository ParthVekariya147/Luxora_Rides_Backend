const express = require('express');
const router = express.Router();
const { addExpense, updateExpense, deleteExpense, listExpenses } = require('./expense.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

router.use(authMiddleware, adminMiddleware);

router.post('/', addExpense);
router.get('/', listExpenses);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

module.exports = router;


