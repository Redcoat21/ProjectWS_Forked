// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/AuthRoutes");

const app = express();
const port = 3000;

// kalau makek http-server
// const http = require('http').Server(app);

// // pakek file static
// app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = require("./routes/web");
app.use("/api", routes);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/auth_example", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
