const express = require('express');
const router = express.Router();
const { getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/category');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUsersById } = require('../controllers/user');

// params
router.param("userId", getUsersById);
router.param("categoryId", getCategoryById);

// Create routes
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);

// Read Routes
router.get("/category/:categoryId", getCategory);
router.get("/categories/", getAllCategories);

// Update Routes
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

// Delete Routes
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory)

module.exports = router;