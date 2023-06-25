const router = require('express').Router();
const { body } = require('express-validator');
const User = require('../models/User');
const authControler = require('../controllers/auth.js');

router.put('/signup',[
    body('email').isEmail()
    .withMessage('Please enter valid email.')
    .custom((value, {req}) =>{
        return User.findOne({email: value}).then(userDoc =>{
            if (userDoc) {
                return Promise.reject('Email already exists!')
            }
        })
    }),
    body('password').trim().isLength({min: 4}),
    body('name').not().isEmpty()
], authControler.signup);

module.exports = router;
