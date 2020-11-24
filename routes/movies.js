// ROUTE:      / === /movielog/v1/movies

// -- IMPORTS -- //
const express = require('express');
const { getMovie } = require('../controllers/movies');

// Set up router
const router = express.Router();

// Route:     /movielog/v1/movies/:title
router.route('/:title')
    .get(getMovie);

// Route:     /movielog/v1/movies/:title/:year
router.route('/:title/:year')
    .get(getMovie);

module.exports = router;