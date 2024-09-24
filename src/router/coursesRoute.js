const express = require('express');
const CoursesRouter = express.Router();
const{validateStudentAuth} = require('../middleware/authValidate')
const {getAllCourses,getQuizQuestions,getAssignmentQuestions,getSingleCourse} = require('../controller/courseControl');

CoursesRouter.route('/')
.get(getAllCourses);

CoursesRouter.route('/:id')
.get(validateStudentAuth,getSingleCourse);

CoursesRouter.route('/quizs/:id')
.get(validateStudentAuth,getQuizQuestions);

CoursesRouter.route('/assignments/:id')
.get(validateStudentAuth,getAssignmentQuestions);

module.exports = CoursesRouter;