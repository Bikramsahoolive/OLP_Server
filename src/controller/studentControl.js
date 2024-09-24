require('dotenv').config();
const {insertEnrollData,findAllEnrolledProgressData} =require('../model/student');
const{fetchAllCourse} = require('../model/courses'); 
const jwt = require('jsonwebtoken');



async function nonEnrolledCourses(req,res){

    try {
        const user = jwt.verify(req.cookies.token,process.env.jwt_secret);

        const enrollmentData =await findAllEnrolledProgressData(user.id);

        const allCoursesData = await fetchAllCourse();
        const enrolledCourseIds = [];
        let response = [];

        
            enrollmentData.forEach((f)=>{
                if(f.studentid === user.id){
                    enrolledCourseIds.push(f.courseid);
                }
            });

            allCoursesData.forEach((e)=>{
                if(!enrolledCourseIds.includes(e.id)){
                    response.push(e);
                }
            });
            
            // console.log(response);

            res.status(200).send(response);
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function enrollStudent(req,res){
    try {
        const user = jwt.verify(req.cookies.token,process.env.jwt_secret);
    let enrollData ={
        courseid:req.params.id,
        studentid:user.id,
        enrollmentstatus:true,
        learningstatus:false,
        quizstatus:false,
        quizresult:0,
        assignmentstatus:false,
        assignmentresult:0,
        coursecompilation:false
    };

   const result = await insertEnrollData(enrollData);
    res.status(200).json({status:'sucess',message:'Course enrolled successfully.'});
    } catch (error) {
        console.log(error);
        
    }
}

async function getAllEnrolledData(req,res){
    try {
        const user = jwt.verify(req.cookies.token,process.env.jwt_secret);

        const enrollmentData =await findAllEnrolledProgressData(user.id);

        const allCoursesData = await fetchAllCourse();

        let response = [];
        allCoursesData.forEach((e)=>{
            enrollmentData.forEach((f)=>{
                if(e.id === f.courseid){
                    response.push(e);
                }
            })
        })

        // console.log(response);
        
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}

async function learningCompleted(req,res){
    const enrollmentId = req.param.id;

}

async function quizCompleted(req,res){
    const enrollmentId = req.param.id;

}

async function assignmentCompleted(req,res){
    const enrollmentId = req.param.id;

}

module.exports={
    nonEnrolledCourses,
    enrollStudent,
    getAllEnrolledData,
    learningCompleted,
    quizCompleted,
    assignmentCompleted
};