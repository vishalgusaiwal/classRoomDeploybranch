const jwt = require('jsonwebtoken');
const user = require('../models/user.model');
const {expressjwt} = require('express-jwt');


const signin = async (req, resp) => {
    try {
        //console.log(req.body);
        let person = await user.findOne({ "email": req.body.email });
        //console.log(person + "\n");
        if (!person) {
            return resp.status('403').json({
                success: false,
                error: "User not found"
            });
        }
        if (!person.authenticate(req.body.password)) {
            return resp.status('401').json({
                success: false,
                error: "Email and password doesn't match"
            });
        }
        const token = jwt.sign({ _id: person._id }, process.env.SecreteKey);
        //console.log(token + "\n");

        resp.cookie('token', token, { expire: new Date() + 9999 });

        return resp.status(200).json({
            success: true,
            token: token,
            user: {
                _id: person._id,
                name: person.name,
                email: person.email,
                educator: person.educator
            }
        });
    } catch (err) {
        return resp.status('401').json({
            success: false,
            error: "Could not sign in"
        });
    }
}

const signout = (req, resp) => {
    resp.clearCookie('token');
    return resp.status('200').json({
        success: true,
        message: "Signed Out successfully"
    });
}

const requireSignin = expressjwt({
    secret: process.env.SecreteKey,
    algorithms: ["HS256"],
    userProperty: 'auth'
});


const hasAuthorization = (req, resp, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        return resp.status('401').json({
            success: false,
            error: "User is not authorized"
        });
    }
    next();
}

module.exports =  { signin, signout, hasAuthorization, requireSignin };

