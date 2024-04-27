const express = require("express");
const app = express();

// kalau makek http-server
// const http = require('http').Server(app);

// // pakek file static
// app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = require("./routes/web");
app.use("/api", routes);

  
const port = 3000;
app.listen(port, function(req, res){
    console.log("Application running on http://localhost:"+port);
});