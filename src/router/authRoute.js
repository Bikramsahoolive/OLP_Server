const express = require('express');
const AuthRouter = express.Router();
const {createUser,getUsers,login,googleLogin,findOneUser,updatePassword,logout,checkSession} = require('../controller/authControl');

AuthRouter.route('/register')
.post(createUser);

AuthRouter.route('/users')
.get(getUsers);

AuthRouter.route('/login')
.post(login);

AuthRouter.route('/google-login')
.post(googleLogin);

AuthRouter.route('/check-session')
.get(checkSession);

AuthRouter.route('/verify')
.post(findOneUser);

AuthRouter.route('/password')
.patch(updatePassword);

AuthRouter.route('/logout')
.post(logout);


module.exports = AuthRouter;