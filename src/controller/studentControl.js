require('dotenv').config();
const {insertEnrollData,findAllEnrolledProgressData,fetchProgressData,updateLearningData,updateQuizData,updateAssignmentData,deleteProgressData} =require('../model/student');
const {fetchSingleCourse,fetchExamData,updateTotalEnrollment} = require('../model/courses');
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
        const courseId = req.params.id
        const courseData = await fetchSingleCourse(courseId);

        const examData = await fetchExamData(courseData.creatorid,courseData.id);
        
        let quizStatus = true;
        let assignmentStatus = true;

        if(examData[0].quiz['question'].length>0) quizStatus = false;
        if(examData[0].assignment['question'].length>0) assignmentStatus = false;
        
        const user = jwt.verify(req.cookies.token,process.env.jwt_secret);

    let enrollData ={
        courseid:courseId,
        creatorid:courseData.creatorid,
        studentid:user.id,
        enrollmentstatus:true,
        learningstatus:false,
        quizstatus:quizStatus,
        quizresult:0,
        assignmentstatus:assignmentStatus,
        assignmentresult:0
    };

   const result = await insertEnrollData(enrollData);
   updateTotalEnrollment(++courseData.totalenrolments,courseData.id);
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

async function studentProgressAndResult(req,res){

    const courseId = req.params.id;
    const user = jwt.verify(req.cookies.token,process.env.jwt_secret);
    const response = await fetchProgressData(courseId,user.id);
    // console.log(response);

    res.status(200).json(response);
    
}

async function learningCompleted(req,res){
    const courseId = req.params.id;
    const user = jwt.verify(req.cookies.token,process.env.jwt_secret);
    const response = await updateLearningData(user.id,courseId);
    res.status(200).json({status:'success',message:'Student learning compiletion updated.'});
}

async function quizCompleted(req,res){
    const courseId = req.params.id;
    const result = req.body.result;

    const user = jwt.verify(req.cookies.token,process.env.jwt_secret);
    const response = await updateQuizData(user.id,courseId,(+result));
    res.status(200).json({status:'success',message:'Student Quiz compiletion updated.'});

}

async function assignmentCompleted(req,res){
    const courseId = req.params.id;
    const user = jwt.verify(req.cookies.token,process.env.jwt_secret);
    const response = await updateAssignmentData(user.id,courseId);
    res.status(200).json({status:'success',message:'Student Assignment compiletion updated.'});
}

async function unenrollCourse(req,res){
    const courseId = req.params.id;
    const user = jwt.verify(req.cookies.token,process.env.jwt_secret);
    const response = await deleteProgressData(courseId,user.id);
}

module.exports={
    nonEnrolledCourses,
    enrollStudent,
    getAllEnrolledData,
    studentProgressAndResult,
    learningCompleted,
    quizCompleted,
    assignmentCompleted,
    unenrollCourse
};