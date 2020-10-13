const express = require('express');
const router = express.Router();
const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus } = require('../controllers/order');
const { updateStock } = require('../controllers/product');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUsersById, pushOrderInPurchaseList } = require('../controllers/user');

// params
router.param('userId', getUsersById);
router.param('orderId', getOrderById);

// routes

// create
router.post('/order/create/userId', isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);
// read
router.get('/order/all/:userId', isSignedIn, isAuthenticated, isAdmin, getAllOrders);

// status of order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put('/order/:orderId/status/:userId', isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router