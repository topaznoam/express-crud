const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.DB_URL);
  const dattbase = mongoose.connection;

  dattbase.on("error", (error) => {
    console.log("Database connection error: ", error);
  });

  dattbase.once("open", () => {
    console.log("connect to database");
  });
};
module.exports = connectDB;
