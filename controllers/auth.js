const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const user = require('../models/user');

const signup = function (req, res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Not able to save user in db",
            });
        }

        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
}

// signin
const signin = function (req, res) {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "Incorrect Email"
            })
        }
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email Or Password don't match"
            })
        }
    
        // create jwt
        const authToken  = jwt.sign({_id: user._id}, process.env.SECRET);
        // put it in cookie
        res.cookie("token", authToken, {expire: new Date() + 9999});
    
        // send res to frontend
        const {_id, name,  role} = user;
        return res.json({authToken, user: {_id, name, email, role}});
    });

    

}

const signout = function (req, res) {
    res.clearCookie("token");
    res.json({
        message: 'Signed Out Successfully'
    });
}

// protected routes
const isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

// custom middlewares
const isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker) {
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();
}

const isAdmin = (req, res, next) => {
    if(req.profile.role == 0) {
        res.status(403).json({
            error: "Unauthorized Access To Admin"
        })
    }
    next();
}

module.exports = {
    signout,
    signup,
    signin,
    isSignedIn,
    isAuthenticated,
    isAdmin
}