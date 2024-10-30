const { IncomingForm } = require('formidable');
const Course = require('../models/course.model');
const { getErrorMessage } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { extend } = require('lodash');
const create = (req, resp) => {
    let form = new IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return resp.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        for (let field in fields) {
            fields[field] = fields[field].toString();
        }
        //console.log(fields);
        let course = new Course(fields);
        course.instructor = req.profile;
        if (files.image) {
            course.image.data = fs.readFileSync(files.image[0].filepath);
            course.image.contentType = files.image[0].memetype;
        }
        try {
            let result = await course.save();
            result.image = undefined;
            result.instructor.hashed_password = undefined;
            result.instructor.salt = undefined;
            return resp.status(200).json(result);
        } catch (err) {
            return resp.status(400).json({
                error: "My custom error message" + getErrorMessage(err)
            });
        }
    });
}

const listByInstructor = async (req, resp) => {
    try {
        let courses = await Course.find({ instructor: req.profile._id }).populate('instructor', '_id name');
        if (!courses) {
            return resp.status(400).json({
                success: false,
                error: getErrorMessage(err)
            });
        }
        return resp.status(200).json(courses);
    } catch (err) {
        return resp.status(400).json({
            success: false,
            error: getErrorMessage(err)
        });
    }
}

const courseById = async (req, resp, next, id) => {
    try {
        let course = await Course.findById(id).populate('instructor', '_id name');
        if (!course) {
            return resp.status(400).json({
                success: false,
                error: "Course not found!!!"
            });
        }
        req.course = course;
        next();
    } catch (err) {
        return resp.status(400).json({
            error: "Could not retrieve course"
        });
    }
}

const read = (req, resp) => {
    req.course.image = undefined;
    return resp.status(200).json(req.course);
}

const photo = (req, resp) => {
    //console.log(req.course.image);
    //console.log("Photo lene aya tha bhai me");
    resp.set('Content-Type', req.course.image.contentType);
    resp.send(req.course.image.data);
}

const newLesson = async (req, resp) => {
    try {
        let lesson = req.body;
        let result = await Course.findByIdAndUpdate(req.course._id, {
            $push: {
                lessons: lesson
            },
            updated: Date.now()
        }, { new: true }).populate('instructor', '_id name').exec();
        return resp.status(200).json({
            success: true,
            lesson: result
        });
    } catch (err) {
        return resp.status(400).json({
            error: getErrorMessage(err)
        });
    }
}

const isInstructor = (req, resp, next) => {
    const isInstructor = req.course && req.auth && req.course.instructor._id == req.auth._id;
    if (!isInstructor) {
        return resp.status(400).json({
            error: "User is not an instructor"
        });
    }
    next();
}

const update = (req, resp) => {
    let form = new IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return resp.status(400).json({
                success: false,
                error: "Something went wrong"
            });
        }
        let course = req.course;
        for (let field in fields) {
            fields[field] = fields[field].toString();
        }
        course = extend(course, fields);
        if (fields.lessons) {
            course.lessons = JSON.parse(fields.lessons);
        }
        course.updated = Date.now();
        if (files.image) {
            course.image.data = fs.readFileSync(files.image[0].filepath);
            course.image.contentType = files.image[0].memetype;
        }
        try {
            await course.save();
            course.image = undefined;
            return resp.status(200).json(course);
        } catch (err) {
            return resp.status(400).json({
                error: "Something went wrong on " + getErrorMessage(err)
            });
        }
    })
}
const remove = async (req, resp) => {
    try {
        let course = req.course;
        let deleteCourse = await Course.deleteOne({ _id: course._id });
        return resp.status(200).json(deleteCourse);
    } catch (err) {
        return resp.status(402).json({
            error: 'Not able to remove the course',
            message: getErrorMessage(err)
        });
    }
}

const listPublished = async (req, resp) => {
    try {
        let courses = await Course.find({ published: true });
        if (!courses) return resp.status(400).json({ error: 'No course found' });
        return resp.status(200).json(courses);
    } catch (err) {
        return resp.status(400).json({
            error: getErrorMessage(err)
        });
    }
}
module.exports = { create, listByInstructor, courseById, read, photo, newLesson, isInstructor, update, remove, listPublished };