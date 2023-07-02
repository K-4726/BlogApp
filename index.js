// require('dotenv').config();
// const express=require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose=require("mongoose");
// const md5=require("md5");
// const bcrypt=require("bcrypt");
// const saltRounds=10;
// const app=express();


// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({extended: true}));
// app.set('view engine', 'ejs');

// mongoose.connect("mongodb://localhost:27017/userDB");

// const userSchema=new mongoose.Schema({
//     email: String,
//     username:String,
//     password: String
// });

// const User=new mongoose.model("User",userSchema);
// app.get("/",function(req,res){
//     res.render("login");
// });
// app.post("/",function(req,res){
//     const inputemail=req.body.eemail;
//     const inputpassword=req.body.passwd;
//     User.findOne({email:inputemail}).then(foundUser=>{
//         bcrypt.compare(inputpassword, foundUser.password, function(err, result) {
//             if(result == true){
//                 res.render("home");
//             }
//         });
//     });
// });

// app.get("/register",function(req,res){
//     res.render("register");
// });
// app.post("/register",function(req,res){
//     if(req.body.password===req.body.confpassword){
//         bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//             const newuser=new User({
//                 email:req.body.ewmail,
//                 username:req.body.uname,
//                 password:hash
//                });
//                newuser.save();
//         });
       
//        res.render("home");
//     }
//     else{
//         app.alert("Please enter the same password in both fields.");
//     }
// });
// app.listen(3000, function() {
//     console.log("Server started on port 3000");
//   });


require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/userDB");

// User schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

// Routes

app.post('/api/saveBlogPost', (req, res) => {
  const { title, content } = req.body;

  // You can perform any necessary actions with the received data here, such as saving it to a database

  // For this example, let's simply log the received data
  console.log('Received blog post:');
  console.log('Title:', title);
  console.log('Content:', content);

  // Send a response back to the client
  res.json({ message: 'Blog post saved successfully' });
});

app.get("/", function (req, res) {
  res.render("login");
});

app.post("/", function (req, res) {
  const inputemail = req.body.eemail;
  const inputpassword = req.body.passwd;
  User.findOne({ email: inputemail }).then(foundUser => {
    bcrypt.compare(inputpassword, foundUser.password, function (err, result) {
      if (result == true) {
        res.redirect("http://localhost:3001");
      }
    });
  });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  if (req.body.password === req.body.confpassword) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      const newuser = new User({
        email: req.body.ewmail,
        username: req.body.uname,
        password: hash
      });
      newuser.save();
    });

    res.redirect("http://localhost:3001");
  } else {
    res.send("Please enter the same password in both fields.");
  }
});

// Serve React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start the server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
