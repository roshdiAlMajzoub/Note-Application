const express = require('express');
const { body } = require('express-validator/check');
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already exists.');
                    }
                });
            }),
        body('password')
            .trim()
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPass').custom((value, {req}) => {
            if (value.trim() !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ], authController.signup);

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email address already exists.');
                }
            });
        }),
        // .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })], authController.login);

module.exports = router;