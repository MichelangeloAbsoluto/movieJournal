// -- IMPORTS & PACKAGES -- //
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect route -- only allowed logged in users, append user to request object
exports.protect = async (req, res, next) => {
    let token;

    console.log('The cookie looks like this: ' + req.cookies);
    
    // Check for token in the cookie
    if (req.cookies){
        token = req.cookies.token; 
    } 
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route.', 401));
    }

    try {
        // Decode the token
        let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Search for matching user, append it to request object.
        let user = await User.findById(decodedToken.id);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
} 

exports.authorizeForAdmin = async (req, res, next) => {
   
    // Check if req.user.role === authorizedRole
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to access this route`, 403));
    } else {
        next();
    }
}



