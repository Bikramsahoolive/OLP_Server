require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const AuthRouter = require('./src/router/authRoute');
const CreatorRouter = require('./src/router/creatorsRoute');
const CoursesRouter = require('./src/router/coursesRoute');

const {createUser,findOne} = require('./src/model/users');

require('./src/config/passport');

app.use(cors({
    origin:'https://c8bltjmv-4200.inc1.devtunnels.ms',
    credentials:true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit:'10mb'}));
app.use(cookieParser());
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true
  }));

app.get('/',(req,res)=>{
    res.status(200).send("Welcome To OLP Server :)");
});

//auth rout
app.use('/auth',AuthRouter);
//creator rout
app.use('/creator',CreatorRouter);
//get all courses
app.use('/courses',CoursesRouter);

//initialize passport middleware;
app.use(passport.initialize());
app.use(passport.session());

// Google authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  async function(req, res) {
    // Successful authentication, redirect to frontend
    const user = req.user;
    const userData =  await findOne(user.useremail);
    if (!userData) {
      createUser(user);
    }else if(userData.usertype){
      user.usertype = userData.usertype;
    }
    
    const token = btoa(JSON.stringify(user));
    res.redirect(301,`https://c8bltjmv-4200.inc1.devtunnels.ms/google-auth/${token}`); //frontend redirection link;
  }
);

// // Route to check if user is authenticated
// app.get('/auth/check', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json(req.user);
//   } else {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// });


app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
    
});