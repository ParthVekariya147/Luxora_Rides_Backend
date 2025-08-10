const Expense = require('./expense.model');

class ExpenseService {
  async createExpense(data) {
    const expense = await Expense.create(data);
    return expense;
  }

  async updateExpense(id, data) {
    const exp = await Expense.findById(id);
    if (!exp) throw new Error('Expense not found');
    Object.assign(exp, data);
    await exp.save();
    return exp;
  }

  async deleteExpense(id) {
    const exp = await Expense.findById(id);
    if (!exp) throw new Error('Expense not found');
    await Expense.deleteOne({ _id: id });
    return { message: 'Expense deleted successfully' };
  }

  async listExpenses(query) {
    const { start, end, category, page = 1, limit = 50 } = query;
    const filter = {};
    if (start && end) filter.date = { $gte: new Date(start), $lte: new Date(end) };
    if (category) filter.category = category;
    const docs = await Expense.find(filter)
      .sort({ date: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Expense.countDocuments(filter);
    return { items: docs, total, page: Number(page), limit: Number(limit) };
  }
}

module.exports = new ExpenseService();


