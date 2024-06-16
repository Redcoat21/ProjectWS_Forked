const express = require("express");
const web = require("./routes/web");
const bodyParser = require('body-parser');
 require("dotenv").config();
const axios =require("axios");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", web);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
