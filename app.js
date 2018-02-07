var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var passport=require("passport");
var User = require("./models/user");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var mongo = require('mongodb');
var path=require('path');




mongoose.connect("mongodb://localhost/authennforsecond");
var app= express();

app.use(express.static(path.join(__dirname,'public')));

app.use(require("express-session")({
secret: "key",
resave:false,
saveUninitialized:false
}));
app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.json())

app.get("/",function(req,res)
{
    res.render("index");
})
app.get("/cardiology",function(req,res)
{
    res.render("cardiology");
})
app.get("/cardiologyform",function(req,res)
{
    res.render("cardiologyform");
})
app.get("/nephrology",function(req,res)
{
    res.render("nephrology");
})
app.get("/nephrologyform",function(req,res)
{
    res.render("nephrologyform");
})
app.get("/neurology",function(req,res)
{
    res.render("neurology");
})
app.get("/neurologyform",function(req,res)
{
    res.render("neurologyform");
})

app.get("/secret",isloggedin,function(req,res)
{
    res.render("secret");
})
app.get("/register",function(req,res)
{res.render("signup");
  
})

app.get("/login",function(req,res)
{
    res.render("login");
})

app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({
        firstname: req.body.firstname,
	lastname:req.body.lastname,
	username:req.body.username,
	
	CPassword:req.body.CPassword,
	category:req.body.category,
	email:req.body.email,
	mobilenumber:req.body.mobilenumber,
	day:req.body.day,
	month:req.body.month,
	year:req.body.year,
	street :req.body.street,
	city:req.body.city,
	state:req.body.state,
    }), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
        });
    });
})
   

app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

function isloggedin(req,res,next){
    if(req.isAuthenticated()){
      return  next();
    }
    res.redirect("/login");
}

app.listen(1000,function(){
    console.log("server started at 1000");
});