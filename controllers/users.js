// IMPORTS 
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');

// @Desc        Get all users,
// @Route       GET /movielog/v1/users
// @Access      Private (admin only)
exports.getUsers = async (req, res, next) => {
    try {
        let users = await User.find().populate({
            path : 'entries',
            select : 'title review'
        });

        if (!users) {
            return next(new ErrorResponse('Could not find any users.', 404));
        }

        res.status(200).json({
            success: true, 
            data: users
        })

    } catch (error) {
        next(error);
    }
}

// @Desc        Get a user,
// @Route       GET /movielog/v1/users/:userId
// @Access      Private (admin only)
exports.getUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.userId).populate({
            path : 'entries',
            select : 'title review'
        });

        if (!user) {
            return next(new ErrorResponse(`Could not find user with id ${req.params.userId}`, 404));
        }

        res.status(200).json({
            success: true, 
            data: user
        })

    } catch (error) {
        next(error);
    }
}

// @Desc        Create a user
// @Route       POST /movielog/v1/users
// @Access      Private (admin only)
exports.createUser = async (req, res, next) => {
    try {
        let users = await User.create(req.body);

        res.status(201).json({
            success: true, 
            data: user
        })

    } catch (error) {
        next(error);
    }
}

// @Desc        Update a user
// @Route       PUT /movielog/v1/users/:userId
// @Access      Private (admin only)
exports.updateUser = async (req, res, next) => {
    try {
        
        let user = await User.findById(req.params.userId);

        if (!user) {
            return next(new ErrorResponse(`Could not find user with id ${req.params.userId}`, 404));
        }
        
       user = await User.findByIdAndUpdate(req.params.userId, req.body, {
            new: true, 
            runValidators: true
        });

        res.status(200).json({
            success: true, 
            data: user
        })

    } catch (error) {
        next(error);
    }
}

// @Desc        Delete a user
// @Route       DELETE /movielog/v1/users/:userId
// @Access      Private (admin only)
exports.deleteUser = async (req, res, next) => {
    try {
        
        let userToDelete = await User.findById(req.params.userId);

        if (!userToDelete) {
            return next(new ErrorResponse(`Could not find user with id ${req.params.userId}`, 404));
        }
        
        await userToDelete.remove();

        res.status(200).json({
            success: true, 
            data: {}
        })

    } catch (error) {
        next(error);
    }
}





