const ErrorResponse = require('../utils/ErrorResponse');

// This middleware logs the error and then sends a customized error response. 

const errorHandler = (err, req, res, next) => {
    // Given an err
    console.log(err);

    // Construct a new error
    let error = new ErrorResponse(err.message, 404);

    // Check a couple specific errors. Change message based on this. 
    // if err.code === 11000 or err.name === 'CastError' 

    // return a response
    res.status(error.statusCode).json({
        success: false, 
        signature: 'Sorry bout the trouble, sir. Error being handled.',
        name: err.name,
        message: error.message
    })
}

module.exports = errorHandler;