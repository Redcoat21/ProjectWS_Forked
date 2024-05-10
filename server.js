const express = require("express");
const userRoutes = require("./routes/userRoutes");
const trackRoutes = require("./routes/trackRoutes");
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/track", trackRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
