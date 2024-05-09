const express = require("express");
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
// harusnya gk ada yang rusak
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
