// Require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Set up port to the host's designated port or 3000
var PORT = process.env.PORT || 3000;

// Initiate Express
var app = express();

// Set up Express Router
var router = express.Router();

// Require our routes file pass router object
require("./config/routes")(router);

// Designate public folder as static directory
app.use(express.static(__dirname + "/public"));

// Connect handlebars
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use bodyParser
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(router);

// If deployed, use the deployed database, otherwise use local mongoHeadlines database
// var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
var db = process.env.MONGODB_URI || "mongodb://localhost:27017/mongoHeadlines"

// Connect mongoose to database
//Connect mongoose to the database
mongoose.connect(db, {
    useNewUrlParser: true
  },
  function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("mongoose connection is successful");
    }
  });


// Listen on port
app.listen(PORT, function () {
  console.log("Listening on port: " + PORT);
});