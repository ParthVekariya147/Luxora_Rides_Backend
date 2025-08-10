const Joi = require('joi');

const base = {
  title: Joi.string().min(2).max(100),
  amount: Joi.number().min(0),
  category: Joi.string().max(50).allow('', null),
  date: Joi.date(),
  notes: Joi.string().max(1000).allow('', null)
};

const createExpenseValidation = Joi.object({
  title: base.title.required(),
  amount: base.amount.required(),
  date: base.date.required(),
  category: base.category,
  notes: base.notes
});

const updateExpenseValidation = Joi.object(base);

module.exports = {
  createExpenseValidation,
  updateExpenseValidation
};


