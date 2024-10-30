const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');
const courseCtrl = require('../controllers/course.controller');
const enrlCtrl = require('../controllers/enrollment.controllers');

router = express.Router();

router.route('/api/enrollment/news/:CourseId').get(authCtrl.requireSignin, enrlCtrl.findEnrollment, enrlCtrl.create);
router.route('/api/enrollments/:enrollmentId').get(authCtrl.requireSignin, enrlCtrl.isStudent, enrlCtrl.read);
router.route('/api/enrollment/completes/:enrollmentId').put(authCtrl.requireSignin, enrlCtrl.isStudent, enrlCtrl.complete);
router.route('/api/enrollment/enrolled').get(authCtrl.requireSignin, enrlCtrl.listEnrolled);
router.route('/api/enrollment/stats/:CourseId').get(enrlCtrl.enrollmentStats);

router.param('CourseId', courseCtrl.courseById);
router.param('enrollmentId', enrlCtrl.enrolmentById);

module.exports = router;