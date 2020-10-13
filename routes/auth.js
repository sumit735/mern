const express = require('express');
const { check } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require('../controllers/auth');

const router = express.Router();


// routes
router.post('/signup', [
    check('name').isLength({
        min: 3
    }).withMessage('Name should be atleast 3 characters'),

    check('email').isEmail().withMessage('Valid Email is required'),

    check('password').isLength({
        min: 3
    }).withMessage('Password should be atleast 3 characters'),

], signup);

// signin route
router.post('/signin', [
    check('email').isEmail().withMessage('Valid Email is required'),
    check('password').isLength({
        min: 6
    }).withMessage('Password should be atleast 6 characters'),

], signin);

router.get('/signout', signout);




module.exports = router;