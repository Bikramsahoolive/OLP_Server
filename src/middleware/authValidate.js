require('dotenv').config();
const jwt = require('jsonwebtoken');


async function validateCreatorAuth(req, res, next) {
    try {

        const userData = jwt.verify(req.cookies.token, process.env.jwt_secret);
        if (userData.usertype === 'creator') {
            next();
        } else {
            res.status(400).json({ status: 'failure', message: 'You are not authorized.' });
        }

    } catch (error) {
        res.status(500).json({ status: 'failure', message: 'Creator authentication Required!' });
    }

}

async function validateStudentAuth(req, res, next) {
    try {

        const userData = jwt.verify(req.cookies.token, process.env.jwt_secret);
        if (userData.usertype === 'student') {
            next();
        } else {
            res.status(400).json({ status: 'failure', message: 'You are not authorized.' });
        }

    } catch (error) {
        res.status(500).json({ status: 'failure', message: 'Stusent authentication Required!' });
    }

}

module.exports = { validateCreatorAuth, validateStudentAuth };