// ROUTE:     / === /movielog/v1/entries...

// NEXT VERSION 
// Figure out all entries vs. user's entries

// -- IMPORTS -- //
const express = require('express');
const { 
    getEntry, 
    getEntries,
    submitEntry, 
    updateEntry, 
    deleteEntry
} = require('../controllers/entries');
const { protect } = require('../middleware/authorization');

// Set up router
const router = express.Router({mergeParams: true});

// -- ROUTES -- // 

// router.route('/users/:userId/entries').get(getUserEntries)

router.route('/')
    .get(protect, getEntries)
    .post(protect, submitEntry);

router.route('/:id')
    .get(protect, getEntry)
    .put(protect, updateEntry)
    .delete(protect, deleteEntry);

// get all entries by a user -- WILL NEED TO RE-REOUTE
router.route('/user/:userId/reviews');

module.exports = router;