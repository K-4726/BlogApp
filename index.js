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
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');

const app = express();

// Middleware
app.use(express.static('public'));
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
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

// User schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  likes: { type: Number, default: 0 },
  comments: [String],
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Routes

app.post('/api/saveBlogPost', async (req, res) => {
  const { title, content } = req.body;

  const newBlogPost = new BlogPost({
    title: title,
    content: content,
    likes: 0,
    comments: [],
  });

  try {
    await newBlogPost.save();
    console.log('Blog post saved successfully');
    res.json({ message: 'Blog post saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save blog post' });
  }
});

app.get('/api/blogposts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();

    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blogposts/:blogId', async (req, res) => {
  const { blogId } = req.params;

  try {
    const blogPost = await BlogPost.findById(blogId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blog post' });
  }
});

app.patch('/api/blogposts/:blogId/like', async (req, res) => {
  const { blogId } = req.params;

  try {
    const blogPost = await BlogPost.findById(blogId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blogPost.likes += 1;

    await blogPost.save();

    res.json({ likes: blogPost.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update likes' });
  }
});

app.post('/api/blogposts/:blogId/comment', async (req, res) => {
  const { blogId } = req.params;
  const { comment } = req.body;

  try {
    const blogPost = await BlogPost.findById(blogId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blogPost.comments.push(comment);
    await blogPost.save();

    res.json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});
app.get('/api/blogposts/:blogId/comments', async (req, res) => {
  const { blogId } = req.params;

  try {
    const blogPost = await BlogPost.findById(blogId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blogPost.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});


app.get('/', function (req, res) {
  res.render('login');
});

app.post('/', function (req, res) {
  const inputemail = req.body.eemail;
  const inputpassword = req.body.passwd;
  User.findOne({ email: inputemail }).then((foundUser) => {
    bcrypt.compare(inputpassword, foundUser.password, function (err, result) {
      if (result == true) {
        res.redirect('http://localhost:3001');
      }
    });
  });
});

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  if (req.body.password === req.body.confpassword) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      const newuser = new User({
        email: req.body.ewmail,
        username: req.body.uname,
        password: hash,
      });
      newuser.save();
    });

    res.redirect('/');
  } else {
    res.send('Please enter the same password in both fields.');
  }
});

// Serve React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start the server
app.listen(3000, function () {
  console.log('Server started on port 3000');
});
