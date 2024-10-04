let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mailer = require('../config/mailscript');
const { createUser, getUser, findOne, findUser, updatePass, updateUsertype,updateUserOtp } = require("../model/users");

exports.login = async (req, res) => {
    try {
        const { useremail, usertype, password } = req.body;
        // console.log(usertype)   
        const user = await findUser(useremail, usertype);

        if (!user) return res.status(400).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });
        if (user.usertype !== usertype) return res.status(400).json({ message: "User not found" });
        delete user.password;
        let token = jwt.sign(user, process.env.jwt_secret);

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' })

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ err })
    }
}

exports.googleLogin = async (req, res) => {
    try {
        const userData = req.body;
        const user = await findOne(userData.useremail);

        if (user.usertype == 'NA') {
            const data = await updateUsertype(userData.usertype, userData.useremail);
            user.usertype = userData.usertype;
        }

        delete user.password;
        let token = jwt.sign(user, process.env.jwt_secret);

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' })

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ err })
    }

}

exports.createUser = async (req, res) => {
    try {
        const userData = req.body;

        const user = await findUser(userData.useremail, userData.usertype);
        if (user) return res.status(400).json({ status: 'failure', message: 'User Already Exist.' });

        const data = await createUser(userData);
        res.status(201).json({ status: 'success', message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updatePassword = async (req, res) => {
    const {otp,password,email,usertype}=req.body;
    
    try {
        const user = await findOne(email,usertype);
        
        if(user.otp !== (+otp))return res.status(400).json({status:'failure',message:"OTP Mismatch"});
        //update password
        const saltRounds = 10;
        const hashed = await bcrypt.hash(password, saltRounds);
        let data = {
            password: hashed,
            email: email,
            usertype:usertype
        }
        const updatemsg = await updatePass(data)
        res.status(200).send(updatemsg)
    } catch (err) {
        console.log(err.error);
        res.status(500).json({ error: err.message })
    }
}

exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    res.status(200).json({ message: "Logout successful" });
};

exports.findOneUser = async (req, res) => {
    const data = req.body;
    const user = await findUser(data.useremail,data.usertype);
    // console.log(user)

    if (!user) res.status(400).json({ message: "User not found" });
    else {
        let otp = Math.floor(Math.random()*1000000);
        //update otp
        updateUserOtp(user.id,otp);
        const clientMail = {
            email:req.body.useremail,
            subject:'OLP Password Reset OTP.',
            content:`
            <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee;">
      <h1 style="color: #333333; font-size: 24px; margin: 0;">Password Reset Request</h1>
    </div>
    <div style="padding: 20px 0; text-align: center;">
      <p style="font-size: 16px; color: #666666; line-height: 1.5;">Hello ${user.username},</p>
      <p style="font-size: 16px; color: #666666; line-height: 1.5;">We received a request to reset your password. Please use the OTP below to proceed with your password reset.</p>
      <p style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0;">${otp}</p>
      <p style="font-size: 16px; color: #666666; line-height: 1.5;">If you did not request a password reset, please ignore this email.</p>
    </div>
    <div style="padding-top: 20px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="font-size: 14px; color: #999999;">Thank you,<br>The Support Team</p>
    </div>
  </div>
</div>`
        }
        mailer.sendMail(clientMail,(result)=>{
            res.send(result);
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const data = await getUser();
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.checkSession = (req, res) => {
    try {
        const user = jwt.verify(req.cookies.token, process.env.jwt_secret);
        if (user) {
            user.isActive = true;
            res.status(200).json(user);
        } else {
            res.status(400).json({ status: false, message: 'Session is expired.' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Login Requird' });
    }
}