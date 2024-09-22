const express = require('express');
const CreatorRouter = express.Router();
// const {loginAuth} = require('../controller/authControl');
const {creatorAddCourse,creatorsCourse} = require('../controller/courseControl');
const {validateCreatorAuth} = require('../middleware/authValidate');


CreatorRouter.route('/add-course')
.post(validateCreatorAuth,creatorAddCourse);

CreatorRouter.route('/courses')
.get(validateCreatorAuth,creatorsCourse);

CreatorRouter.route('/course')
// .patch(validateCreatorAuth,);

module.exports = CreatorRouter;