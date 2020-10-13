const express = require('express');
const router = express.Router();

const { getUsersById, getUser, updateUser, userPurchaseList } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');

router.param("userId", getUsersById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

router.get('/orders/user/:userId', isSignedIn, isAuthenticated, userPurchaseList);




module.exports = router;
