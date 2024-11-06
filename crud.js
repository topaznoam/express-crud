const express = require("express");
const routes = require("./routes");
const connectDB = require("./lib/connect");
const app = express();
app.use(express.json());
app.use(routes);

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on http://localhost:3000");
});
