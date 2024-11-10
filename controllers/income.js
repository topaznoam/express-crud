const { z } = require("zod");
const User = require("../models/user");
const { userIdValidation } = require("../lib/validation/user");
const {
  incomeScheme,
  incomeIdValidation,
} = require("../lib/validation/income");
const Income = require("../models/income");

const addIncome = async (req, res) => {
  try {
    const userId = userIdValidation.parse(req.params.userId);
    const { title, description, amount, tag, currency } = incomeScheme.parse(
      req.body
    );
    const userExits = await User.findById(userId);
    if (!userExits) {
      return res.status(404).json({ message: "User not found" });
    }
    const income = new Income({ title, description, amount, tag, currency });
    await income.save();
    userExits.incomes.push(income);
    await userExits.save();
    return res.status(200).json({ message: "Income added successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getIncomes = async (req, res) => {
  try {
    const userId = userIdValidation.parse(req.params.userId);

    const userExits = await User.findById(userId);
    if (!userExits) {
      return res.status(404).json({ message: "User not found" });
    }
    const income = await Income.find({ _id: { $in: userExits.incomes } });
    return res.status(200).json(income);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateIncome = async (req, res) => {
  try {
    const userId = userIdValidation.parse(req.params.userId);
    const incomeId = incomeIdValidation.parse(req.params.incomeId);
    const { title, description, amount, tag, currency } = incomeSchema.parse(
      req.body
    );
    const userExits = await User.findById(userId);
    if (!userExits) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!userExits.incomes.includes(incomeId)) {
      return res.status(404).json({ message: "Income not found" });
    }
    const updatedIncome = await Income.findByIdAndUpdate(incomeId, {
      title,
      description,
      amount,
      tag,
      currency,
    });
    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }
    await updatedIncome.save();
    return res.status(200).json({ message: "Income added successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deleteIncome = async (req, res) => {
  try {
    const userId = userIdValidation.parse(req.params.userId);
    const incomeId = incomeIdValidation.parse(req.params.incomeId);
    const userExits = await User.findById(userId);
    if (!userExits) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!userExits.incomes.includes(incomeId)) {
      return res.status(404).json({ message: "Income not found" });
    }
    await Income.deleteOne({ _id: incomeId });
    userExits.incomes = userExits.incomes.filter(
      (incomes) => incomes.toString() !== incomeId
    );
    await userExits.save();
    return res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
};
