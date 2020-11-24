const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getMe, 
    updateDetails, 
    updatePassword 
} = require('../controllers/auth');
const { protect } = require('../middleware/authorization');
const router = express.Router();

// TO IMPLEMENT:
// forgotPassword, 
// resetPassword,

// ROUTE     /movielog/api/auth
router.route('/me').get(protect, getMe);
router.route('/updateDetails').post(protect, updateDetails);
router.route('/updatePassword').post(protect, updatePassword);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

module.exports = router;