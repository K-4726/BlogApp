require('dotenv').config();
const express=require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const md5=require("md5");
const app=express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
    email: String,
    username:String,
    password: String
});

const User=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    if(req.body.password===req.body.confpassword){
       const newuser=new User({
        email:req.body.ewmail,
        username:req.body.uname,
        password:md5(req.body.password)
       });
       newuser.save();
       res.render("home");
    }
    else{
        app.alert("Please enter the same password in both fields.");
    }
});
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });