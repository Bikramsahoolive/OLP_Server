require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

//routing imports
const AuthRouter = require('./src/router/authRoute');
const CreatorRouter = require('./src/router/creatorsRoute');
const CoursesRouter = require('./src/router/coursesRoute');
const StudentRouter = require('./src/router/studentsRoute');

const {createUser,findOne} = require('./src/model/users');

require('./src/config/passport');

app.use(cors({
    origin:process.env.frontend_url,
    origin:'http://localhost:4200',
    credentials:true
}));

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit:'15mb'}));
app.use(cookieParser());
// app.use(morgan('dev'));
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true
  }));

app.get('/',(req,res)=>{
    res.status(200).send("Welcome To OLP Server :)");
});

//handel all auth routes
app.use('/auth',AuthRouter);
//handel all creator routes
app.use('/creator',CreatorRouter);
//handel all courses routes
app.use('/courses',CoursesRouter);
//handel all students routes
app.use('/student',StudentRouter);

//initialize passport middleware;
app.use(passport.initialize());
app.use(passport.session());

// Google authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  async function(req, res) {
    const user = req.user;
    const userData =  await findOne(user.useremail);
    if (!userData) {
      createUser(user);
    }else if(userData.usertype){
      user.usertype = userData.usertype;
    }
    // Successful authentication, redirect to frontend url.
    const token = btoa(JSON.stringify(user));
    res.redirect(301,`${process.env.frontend_url}/google-auth/${token}`);
  }
);

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
    
});