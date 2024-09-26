const express = require('express');
const StudentRouter = express.Router();
// const {loginAuth} = require('../controller/authControl');
const {nonEnrolledCourses,enrollStudent,getAllEnrolledData,studentProgressAndResult,learningCompleted,quizCompleted,assignmentCompleted,unenrollCourse} = require('../controller/studentControl');
const {validateStudentAuth} = require('../middleware/authValidate');


StudentRouter.route('/courses')
.get(validateStudentAuth,nonEnrolledCourses);

StudentRouter.route('/progress/:id')
.get(validateStudentAuth,studentProgressAndResult);

StudentRouter.route('/enroll/:id')
.post(validateStudentAuth,enrollStudent);

StudentRouter.route('/enrolled-courses')
.get(validateStudentAuth,getAllEnrolledData);

StudentRouter.route('/complete-learning/:id')
.patch(validateStudentAuth, learningCompleted);

StudentRouter.route('/complete-quiz/:id')
.patch(validateStudentAuth, quizCompleted);

StudentRouter.route('/complete-assignment/:id')
.patch(validateStudentAuth, assignmentCompleted);

StudentRouter.route('/unenroll/:id')
.delete(validateStudentAuth, unenrollCourse);

module.exports = StudentRouter;