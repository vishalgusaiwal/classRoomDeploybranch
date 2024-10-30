const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    lessonStatus: [{
        lesson: {
            type: mongoose.Schema.ObjectId,
            ref: 'Lesson'
        },
        complete: Boolean
    }],
    enrolled: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    comleted: Date
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);