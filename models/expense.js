const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, require: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, require: true },
    tag: {
      type: String,
      require: true,
      enum: [
        "food",
        "rent",
        "transport",
        "clothing",
        "entertainment",
        "health",
        "education",
        "other",
      ],
    },
    currency: {
      type: String,
      require: true,
      default: "ILS",
      enum: ["ILS", "USD", "EUR"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
