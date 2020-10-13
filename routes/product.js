const express = require('express');
const router = express.Router();
const { getProductById, createProduct, getProduct, photo, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategories } = require('../controllers/product');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUsersById } = require('../controllers/user');

// params
router.param("userId", getUsersById);
router.param("productId", getProductById);

// Routes
// create route
router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct);

// read routes
router.get('/product/:productId', getProduct);
router.get("/product/photo/:productId", photo);

// Update Routes
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

// Delete Routes
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);

// Listing Route
router.get('/products', getAllProducts);

// get distinct categories
router.get('/products/categories', getAllUniqueCategories)

module.exports = router;