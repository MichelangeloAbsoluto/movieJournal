// Handles all routes from      /movielog/v1/auth....

// -- IMPORTS -- //
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const crypto = require('crypto');

// @Desc        Register a user
// @Route       POST /api/v1/auth/register
// @Access      Public
exports.registerUser = async (req, res, next) => {
    try {
        // Deconstruct data from req.body
        let { name, email, password } = req.body;

        // use User model to create a new user
        let user = await User.create({ name, email, password });

        // Give user a token.

        // Send back response
        res.status(201).json({
            success: true, 
            data: user
        })
    } catch (error) {
        next(error);
    }
} 

// @Desc        Login as a user
// @Route       POST /api/v1/auth/login
// @Access      Public
exports.loginUser = async (req, res, next) => {
    try {
        // Grab email & password
        let { email, password } = req.body;

        // Check if email registered to a user in database & grab that user
        let user = await User.findOne({ email }).select('+password');
        if (!user){
            return next(new ErrorResponse(`No user found with email ${email}`, 401));
        }

        // Compare password & entered password
        let isPasswordCorrect = await user.matchPassword(password);

        // if password wrong
        if (isPasswordCorrect === false){
            return next(new ErrorResponse(`Invalid login credentials.`, 404));
        }

        // If credentials valid, give user webtoken.
        sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
}

// @Desc        Logout a user
// @Route       GET /api/v1/auth/login
// @Access      Public
exports.logoutUser = async (req, res, next) => {
    try {
        // Clear cookie 
        res.cookie('token', 'none', { expires: new Date(Date.now() + 1000) });

        // Send back response
        res.status(200).json({ 
            success: true,
            data: {}
        })

    } catch (error) {
        next(error);
    }
}

// @Desc        Get the currently logged-in user
// @Route       GET /api/v1/auth/me
// @Access      Private (must be logged-in)
exports.getMe = async (req, res, next) => {
   try {
       console.log(req.user);
       let user = await User.findById(req.user.id);
       res.status(200).json({
           success: true, 
           data: user
       })
   } catch (error) {
       next(error);
   }
}

// @Desc        Update logged-in user's details
// @Route       POST /api/v1/auth/updateDetails
// @Access      Private (must be logged-in)
exports.updateDetails = async (req, res, next) => {
    try {
        // Grab new name and email
        let fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email
        }

        // Update in Mongo DB
        let updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        // Return succeess
        res.status(200).json({
            success: true,
            data: updatedUser
        })
    } catch (error) {
        next(error);
    }
}

// @Desc        Update logged-in user's password
// @Route       POST /api/v1/auth/updatePassword
// @Access      Private (must be logged-in)
exports.updatePassword = async (req, res, next) => {
    try {
        // Grab user
        let user = await User.findById(req.user.id).select('+password');

        // Compare password & entered password
        let isPasswordCorrect = await user.matchPassword(req.body.currentPassword);

        // if password wrong
        if (isPasswordCorrect === false){
            return next(new ErrorResponse(`Password is incorrect.`, 404));
        }

       // If password correct, update password. 
       user.password = req.body.newPassword;
       await user.save();

       sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
}

// Forgot password 

// Reset password


// HELPER FUNCTION: Given web token to user. 
// Web token should include user's ID. Will use this ID to allow access to certain routes later. 
// Creates a JSON Web Token, stores it in a cookie, sends response with cookie to user. 
const sendTokenResponse = (user, statusCode, res) => {
    // Create signed Json Web Token
    let jwtToken = user.getSignedJstToken();

    // Create options for cookie
    let cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION_DATE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', jwtToken, cookieOptions)
        .json({ 
            success: true,
            token: jwtToken     
        });
}
