const express = require("express");
const userRoutes = require("./routes/userRoutes");
const trackRoutes = require("./routes/trackRoutes");
const dotenv = require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use("/user", userRoutes);
app.use("/track", trackRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
