var express=require('express'),
    mongooose=require('mongoose'),
    passport=require('passport'),
    bodyParser=require("body-parser"),
    User=require('./models/user');
    LocalStrategy=require('passport-local'),
    passportLocalMongoose=require('passport-local-mongoose');

var app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
mongooose.connect("mongodb://localhost/auth_demo_app",{ useNewUrlParser: true,useUnifiedTopology: true });


//important and necessary code for passport authentication
app.use(require('express-session')({
    secret:"Rusty is best and cutest dog",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//important and necessary code for passport authentication

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/secret',(req,res)=>{
    res.render('secret');
});

//auth Routes

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',(req,res)=>{
    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
        if(err){
        console.log(err);
        return res.render('register');
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect('/secret');
        })
    })
     
});
app.get('/login',(req,res)=>{
    res.render('login');
});


app.listen(3000,()=>{
    console.log('server started at 3000 port');
});