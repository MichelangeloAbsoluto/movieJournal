// TO DO:

// Implement a front end that receives JSON and displays in simplest fucking way possible

// Rewrite front-end to work.
        // Response object = { success: true, data: {movieObject} }

// Need to implement user's in the browser. 


// --- PACKAGES --- //
const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb'); 
const fetch = require('node-fetch');
const colors = require('colors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// -- IMPORTS -- //
const connectDB = require('./config/db.js');
const movies = require('./routes/movies');
const entries = require('./routes/entries');
const auth = require('./routes/auth');
const users = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');


// --- MIDDLEWARE & CONFIG --- //

// Load env variables
dotenv.config({ path : './config/config.env'});

var PORT = process.env.PORT || 5000;

// Config
var app = express();
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler);

// Mount routers
app.use('/movielog/v1/movies', movies);
app.use('/movielog/v1/entries', entries);
app.use('/movielog/v1/auth', auth);
app.use('/movielog/v1/users', users);

// Connect to Database
connectDB();


app.listen(PORT, () => console.log("Server running, captain."));


// To-Do for Version 2:

// Create resetPassword route
// Create forgotPassword route
// Write custom messaging for Error Handling. 

// Cannot be multiple entries for the same movie by the same user.
    // IMDB id and user cannot be same for two entries.