require('dotenv').config();
const jwt = require('jsonwebtoken');


async function validateCreatorAuth (req,res,next){
    try {
        const userData = jwt.verify(req.cookies.token,process.env.jwt_secret);
        if(userData.type ==='creator'){
            next();
        }else{
            res.status(400).json({status:'failure',message:'Creator authentication required.'});
        }
    
    } catch (error) {
        res.status(500).json({status:'failure',message:'Internal Server Error!'});
    }
    
}

module.exports = {validateCreatorAuth};