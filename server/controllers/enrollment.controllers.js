const { getErrorMessage } = require('../helpers/dbErrorHandler');
const Enrollment = require('../models/enrollment.model');

const findEnrollment = async (req, resp, next) => {
    try {
        let enrollment = await Enrollment.find({ course: req.course._id, student: req.auth._id });
        if (enrollment.length == 0) next();
        else return resp.status(200).json({ result: enrollment[0], success: true });
    } catch (err) {
        return resp.status(400).json({
            success: false,
            error: getErrorMessage(err)
        });
    }
}

const create = async (req, resp) => {
    let newEnrollment = {
        course: req.course,
        student: req.auth
    };
    newEnrollment.lessonStatus = req.course.lessons.map((lesson) => {
        return { lesson: lesson, complete: false };
    });
    const enrollment = new Enrollment(newEnrollment);
    console.log(enrollment);
    try {
        let result = await enrollment.save();
        console.log(result);
        result.course.image = undefined;
        return resp.status(200).json({
            success: true,
            result: result
        });
    } catch (err) {
        return resp.status(400).json({
            success:false,
            error: getErrorMessage(err)
        });
    }
}

const isStudent = (req, resp, next) => {
    //console.log("It reached here but don't know what happened?");
    const isStudent = req.auth && req.auth._id == req.enrollment.student._id;
    if (!isStudent) {
        return resp.status(400).json({
            success: false,
            error: "User is not a enrolled"
        });
    }
    next();
}

const read = (req, resp) => {
    req.enrollment.course.image = undefined;
    //console.log(req.enrollment);
    return resp.status(200).json(req.enrollment);
}

const enrolmentById = async (req, resp, next, id) => {
    try {
        //console.log("Hi how are you?");
        let enrollment = await Enrollment.findById(id).populate({ path: 'course', populate: { path: 'instructor', select: '-hashed_password' } }).populate('student', '_id name');
        
        //console.log(enrollment);
        if (!enrollment) {
            return resp.status(400).json({
                success: false,
                error: 'Enrollment not found'
            });
        }
        req.enrollment = enrollment;
        next();
    } catch (err) {
        return resp.status(400).json({
            success: false,
            error: getErrorMessage(err)
        });
    }
}

const complete = async (req, resp) => {
    //console.log(req.body + " in Complete Api->");
    let updatedData = {
        updated: Date.now(),
        'lessonStatus.$.complete': req.body.complete
    }
    //console.log(updatedData + "\n");
    if (req.body.courseCompleted) {
        updatedData.completed = req.body.courseCompleted;
    }
    try {
        let enrollment = await Enrollment.updateOne({ 'lessonStatus._id': req.body.lessonStatusId }, { '$set': updatedData });
        console.log(enrollment);
        return resp.status(200).json(enrollment);
    } catch (err) {
        return resp.status(200).json({
            success: false,
            error: getErrorMessage(err)
        });
    }
}

const listEnrolled = async (req, resp) => {
    try {
        console.log("came here");
        let enrollments = await Enrollment.find({ student: req.auth._id }).sort({ 'completed': 1 }).populate('course', '_id name category');
        return resp.status(200).json(enrollments);
    } catch (err) {
        return resp.status(400).json({
            success: false,
            error: getErrorMessage(err)
        });
    }
}

const enrollmentStats = async (req, resp) => {
    try {
        let stats = {};
        stats.totalEnrolled = await Enrollment.find({ course: req.course._id }).countDocuments();
        stats.totalCompleted = await Enrollment.find({ course: req.course._id }).exists('completed', true).countDocuments();
        return resp.status(200).json(stats);
    } catch (err) {
        return resp.status(400).json({
            success: false,
            error: getErrorMessage(err)
        });
    }
}

module.exports = { findEnrollment, create, isStudent, read, enrolmentById, complete, listEnrolled, enrollmentStats };