require('dotenv').config()
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const AuthRouter = require('./src/router/authRoute');
const CreatorRouter = require('./src/router/creatorsRoute');
const {getAllCourses} = require('./src/controller/courseControl')
require('./src/config/passport');
app.use(cors({
    origin:'https://localhost:4200',
    credentials:true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({limit:'5mb'}));
app.use(cookieParser());
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
  }));

app.get('/',(req,res)=>{
    res.status(200).send("Welcome To OLP Server :)");
})

app.use('/auth',AuthRouter);
app.use('/creator',CreatorRouter);

app.get('/all-course',getAllCourses);


app.use(passport.initialize());
app.use(passport.session());

// Google authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to frontend
    console.log(req.user);
    
    res.redirect('http://localhost:4200/dashboard');
  }
);

// // Route to check if user is authenticated
app.get('/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});


app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
    
})