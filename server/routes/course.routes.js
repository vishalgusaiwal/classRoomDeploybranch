const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');
const courseCtrl = require('../controllers/course.controller');
const router = express.Router();

router.route('/api/courses/by/:userId').post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isEducator, courseCtrl.create);
router.route('/api/courses/by/:userId').get(authCtrl.requireSignin, authCtrl.hasAuthorization, courseCtrl.listByInstructor);
router.route('/api/course/:courseId').get(courseCtrl.read);
router.route('/api/courses/photo/:courseId').get(courseCtrl.photo);
router.route('/api/courses/:courseId/lesson/new').put(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.newLesson);
router.route('/api/course/:courseId').put(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.update);
router.route('/api/course/:courseId').delete(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.remove);
router.route('/api/courses/published').get(courseCtrl.listPublished);

router.param('userId', userCtrl.userById);
router.param('courseId', courseCtrl.courseById);

module.exports = router;