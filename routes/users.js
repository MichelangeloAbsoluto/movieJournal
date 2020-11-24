// ROUTE :     movielog/v1/users

// -- IMPORTS & PACKAGES -- //
const express = require('express');
const entriesRouter = require('./entries');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const { protect, authorizeForAdmin } = require('../middleware/authorization');

// Create router
const router = express.Router();

// DESC     Get all entries by a user ... re-route to entries router.
// ROUTE    movielog/users/:userId/entries ... re-route to entries router
router.use('/:userId/entries', entriesRouter);

// ADMIN ROUTES 
// Create User
// Update User
// Delete User

router.route('/')
    .get(protect, authorizeForAdmin, getUsers)
    .post(protect, authorizeForAdmin, createUser);

router.route('/:userId')
    .get(protect, authorizeForAdmin, getUser)
    .put(protect, authorizeForAdmin, updateUser)
    .delete(protect, authorizeForAdmin, deleteUser);

// POSSIBLE ... put here or in auth?
// Like or comment other people's reviews?
// Add movie to watchlist?
// Write bio?

module.exports = router;