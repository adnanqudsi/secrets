require('dotenv').config();
const express= require("express");
const bodyparser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const app= express();
const encrypt = require("mongoose-encryption");
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userdb",{useNewUrlParser: true, useUnifiedTopology: true})
const userSchema= new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt,{secret:(process.env.SECRET), encryptedFields:["password"]});
const User= new mongoose.model("user", userSchema);

console.log(process.env.API_KEY);

app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/",function(req,res){
  res.render("home");
});
app.post("/register", function(req,res){
  const newUser= new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
  const username= req.body.username;
  const password= req.body.password;
  User.findOne({email: username}, function(err, found){
  if(err){
    console.log(err);
  }
  else{
    if(found){
      if(found.password === password){
        res.render("secrets");
      }
      else{
        res.alert("wrong password");
      }
  }
    else{res.send("please register");}
}});
});
app.listen(3000,function(){
  console.log("succefully launched the server");
});
