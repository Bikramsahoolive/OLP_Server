const {insertData,fetchAllCourse, fetchCreatorsCourse,insertExamData,fetchQuizOfCourseId,fetchAssignmentOfCourseId,fetchSingleCourse,deleteOne} =require('../model/courses');
const jwt = require('jsonwebtoken');

 async function creatorAddCourse (req,res){
    const user = jwt.verify(req.cookies.token,process.env.jwt_secret);
    
    const coursedata =req.body;

    coursedata.creatorid = user.id;
    coursedata.creatorname = user.username;

    const result = await insertData(coursedata);
    const examData = {
        courseid:result.id,
        creatorid:user.id,
        quiz:{question:coursedata.quizzes},
        assignment:{question:coursedata.assignments}
    }
    const examDataStatus =await insertExamData(examData)
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

async function getQuizQuestions(req,res){

    try {
        const result =await fetchQuizOfCourseId(req.params.id);
        console.log(result);
        res.status(200).json(result);
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function getAssignmentQuestions(req,res){

    try {
        const result =await fetchAssignmentOfCourseId(req.params.id);
        console.log(result);
        res.status(200).json(result);
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function getSingleCourse(req,res){
    const id = req.params.id;


    let result = await fetchSingleCourse(id);
    
    if(result){
    res.status(200).json(result);
    }else{
        res.status(400).send('No data found.');
    }
    

}

async function deleteCourse(req,res){

    try {
        const response = await deleteOne(req.params.id);
        res.status(200).json({status:'success',message:'Course Deleted Successfully.'});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
        
    }

}


module.exports ={creatorAddCourse,getAllCourses,
    creatorsCourse,getQuizQuestions,getAssignmentQuestions,getSingleCourse,deleteCourse};