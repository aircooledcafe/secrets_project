//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function (err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
      console.log("New user added succesfully.");
    }
  });
});

app.post("/login", function(req, res){
  const loginUser = req.body.username;
  const loginPassword = req.body.password;
  User.findOne({email: loginUser}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else if (foundUser) {
        if (loginPassword === foundUser.password) {
          res.render("secrets");
          console.log("Success.");
        } else {
          console.log("Password does not match");
        }
      } else {
        console.log("No user found with that email address.");
      }
  });
});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});