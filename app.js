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
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//important and necessary code for passport authentication

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/secret',isLoggedIn,(req,res)=>{
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

app.post('/login', passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),(req,res)=>{

});

app.get("/logout",(req,res)=>{
   req.logout();
   res.redirect('/');
});
 ///middleware to authenticate and  open secret page 
function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,()=>{
    console.log('server started at 3000 port');
});