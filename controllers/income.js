const { z } = require("zod");
const User = require("../models/user");
const { userIdValidation } = require("../lib/validation/user");
const incomeSchema = require("../lib/validation/income");

const addIncome = async (req, res) => {
  try {
    const useId = userIdValidation.parse(req.params.useId);
    const { title, description, amount, tag, currency } = incomeSchema.parse(
      req.body
    );
    const userExits = await User.findById(useId);
    if (!userExits) {
      return res.status(404).json({ message: "User not found" });
    }
    const income = new income({ title, description, amount, tag, currency });
    await income.save();
    userExits.incomes.push(income);
    await userExits.save();
    return res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(200).json({ message: "Internal server error" });
  }
};

module.exports = {
  addIncome,
};
