const express = require('express');
const CoursesRouter = express.Router();
const{validateStudentAuth} = require('../middleware/authValidate')
const {getAllCourses,getQuizQuestions,getAssignmentQuestions} = require('../controller/courseControl');

CoursesRouter.route('/')
.get(getAllCourses);

CoursesRouter.route('/quizs/:id')
.get(validateStudentAuth,getQuizQuestions);

CoursesRouter.route('/assignments/:id')
.get(validateStudentAuth,getAssignmentQuestions);

module.exports = CoursesRouter;