let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, getUser, findOne, findUser, updatePass, updateUsertype } = require("../model/users");

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
    try {
        const saltRounds = 10;
        const hashed = await bcrypt.hash(req.body.newpassword, saltRounds);
        let data = {
            hashedPassword: hashed,
            id: req.params.id
        }
        const updatemsg = await updatePass(data)
        res.status(200).send(updatemsg)
    } catch (err) {
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
    const user = await findOne(req.body.useremail)
    // console.log(user)
    if (!user) res.status(400).json({ message: "User not found" });
    else {
        res.status(200).json({ user: user })
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