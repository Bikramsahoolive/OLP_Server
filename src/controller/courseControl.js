const {insertData,fetchAllCourse, fetchCreatorsCourse} =require('../model/courses');
const jwt = require('jsonwebtoken');
 async function creatorAddCourse (req,res){
    const user = jwt.verify(req.headers['auth-token'],process.env.jwt_secret);

    const coursedata =req.body;
    coursedata.creatorId = user.id;
    coursedata.creatorName = user.name;

    const result = await insertData(data);
    res.status(200).json({status:'success',message:'Course created successfully'});
}

async function getAllCourses(req,res) {
    
    const data = await fetchAllCourse();
    // console.log(data);
    
    res.status(200).json(data);
    
}

async function creatorsCourse(req,res){

    const user = jwt.verify(req.cookies.token,process.env.jwt_secret);
    const data = await fetchCreatorsCourse(user.id);
    // console.log(data);
    
    res.status(200).json(data);
}



module.exports ={creatorAddCourse,getAllCourses,creatorsCourse};