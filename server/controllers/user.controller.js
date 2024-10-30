const user = require('../models/user.model');
const errorHandler = require('../helpers/dbErrorHandler');
const extend = require('lodash/extend');

const create = async (req, resp) => {
    //console.log("Hy");
    const person = new user(req.body);
    try {
        await person.save();
        return resp.status(200).json({
            success: true,
            message: 'Successfully Signed Up'
        });
    } catch (err) {
        return resp.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const userById = async (req, resp, next, id) => {
    //console.log("HY By UserById")
    try {
        let person = await user.findById(id);
        //console.log(person + "\n");
        //console.log(req.body);
        if (!person) {
            return resp.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        req.profile = person;
        next();
    } catch (err) {
        return resp.status(400).json({
            success: false,
            error: 'Could not retrieve user'
        });
    }
}

const read = (req, resp) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return resp.status('200').json({
        success: true,
        profile: req.profile
    });
}


const remove = async (req, resp) => {
    try {
        let person = req.profile;
        let deleteUser = await user.deleteOne({ _id: person._id });
        //console.log(deleteUser);
        deleteUser.hashed_password = undefined;
        deleteUser.salt = undefined;
        return resp.status(200).json({
            success: true,
            user: deleteUser
        });
    } catch (err) {
        return resp.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const isEducator = (req, resp, next) => {
    const val = req.profile && req.profile.educator;
    if (!val) {
        return resp.status(403).json({
            success: false,
            message: 'User is not an educator'
        });
    }
    next();
}

const update = async (req, resp) => {
    try {
        let person = req.profile;
        person = extend(person, req.body);
        person.updated = Date.now();
        await person.save();
        person.hashed_password = undefined;
        person.salt = undefined;
        return resp.status(200).json({
            success: true,
            user: person
        });
    } catch (err) {
        //console.log(errorHandler.getErrorMessage(err));
        return resp.status(400).json({
            error: "Updating profile is not possible",
            message: errorHandler.getErrorMessage(err)
        });
    }
}

const list = async (req, resp) => {
    try {
        let users = await user.find({});
        if (users.length > 0) {
            return resp.status(200).json({
                users: users
            });
        } else {
            return resp.status(402).json({
                success: false,
                error: 'No user Found'
            });
        }
    } catch (err) {
        return resp.status(403).json({
            success: false,
            error: errorHandler.getErrorMessage(err)
        });
    }
}

module.exports = { create, remove, read, isEducator, userById, update, list };