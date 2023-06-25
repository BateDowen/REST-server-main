const User = require('../models/User');
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');

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

}