const expenseService = require('./expense.service');
const { createExpenseValidation, updateExpenseValidation } = require('./expense.validation');

const addExpense = async (req, res) => {
  try {
    const { error } = createExpenseValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const exp = await expenseService.createExpense(req.body);
    return res.status(201).json({ success: true, data: exp });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { error } = updateExpenseValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const exp = await expenseService.updateExpense(req.params.expenseId, req.body);
    return res.status(200).json({ success: true, data: exp });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.params.expenseId);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const listExpenses = async (req, res) => {
  try {
    const data = await expenseService.listExpenses(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addExpense,
  updateExpense,
  deleteExpense,
  listExpenses
};


