const User = require('../models/User');
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'someSuperSecret';

exports.signup = (req,res,next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
        
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
    .hash(password,12)
    .then( hashedPass =>{
        const user = new User({
            email: email,
            password: hashedPass,
            name: name
        });
        return user.save()
    })
    .then(result =>{
        res.status(201).json({message: 'User created!', userId: result._id})
    })
    .catch(err =>{
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    });
};

exports.login = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
    .then(user =>{
        if (!user) {
            const error = new Error('Email cannot be found!');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)
    })
    .then(isEqual =>{
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        },secret,{
            expiresIn: '1h'
        });
        res.status(200).json({ token:token, userId: loadedUser._id.toString() })
    })
    .catch(err =>{
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    });

}