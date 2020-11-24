// Handles all requests from route "/movielog/v1/entries..."

const fetch = require('node-fetch');
const Entry = require('../models/Entry');
const ErrorResponse = require('../utils/ErrorResponse');

// NEXT VERSION:
// Add mongo filters to getEntries, i.e. get all entries above certain rating.
// Add cast as array to entries, so can use $in operator for cast property

// @Desc        Get all movie entries, able to search by any parameter
// @Route       GET /movielog/v1/entries
// @Desc2       Get all movie entries for a specific user.
// @Route2      GET /movielog/v1/user/:userId/entries
// @Access      Private (only logged-in user)
exports.getEntries = async (req, res, next) => {
    try {
        // EXAMPLE QUERY: 
        // movielog/v1/entries?director=martin_scorsese&select=title,director,review
        // queryParameters = {  "director":"martin_scorsese", "select": "title,director,review" }

        let queryParameters = { ...req.query};

        // Check if searching by user.
        if (req.params.userId) {
            queryParameters.user = req.params.userId;
        }
        
        // Remove special fields from the queryParameters object
        let fieldsToExclude = ['select', 'sort', 'limit', 'page'];
        fieldsToExclude.forEach( field => delete queryParameters[field]);

        // Start building query
        let query = Entry.find(queryParameters);

        // Add select filters to query. Default is title, year, director, plot, review
        if (req.query.select) {
            // 'title,director,review' becomes 'title director review' 
            let selectField = req.query.select.split(',').join(' ');
            query = query.select(selectField);        
        } else {
            query = query.select('title year director rating plot review');
        }

        // Add sort filters to query. Default is by year
        if (req.query.sort){
            let sortField = req.query.sort.split(',').join(' ');
            query = query.sort(sortField);
        } else {
            query = query.sort('year');
        }
        
        // Call actual query.
        let entries = await query;

        if (!entries || entries.length === 0) {
            return next(new ErrorResponse(`No movies entries`, 404));
        }

        res.status(200).json({
            success: true, 
            data: entries
        });
    } catch (error) {
        next(error);
    }
}

// @Desc        Get single entry by id
// @Route       GET /movielog/v1/entries/:id
// @Access      Private (only logged-in user)
exports.getEntry = async (req, res, next) => {
    try {
        let entry = await Entry.findById(req.params.id);

        if (!entry) {
            return next(new ErrorResponse(`Could not find entry with id ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true, 
            data: entry
        });
    } catch (error) {
        next(error);
    }
}

// @Desc        Submit a movie entry
// @Route       POST /movielog/v1/entries
// @Access      Private (only logged-in users)
exports.submitEntry = async (req, res, next) => {
    try {
        
        // Use req.body as default data. If cookies has a movie object, it will use that as data instead and clear it.


        // Append user.id to data
        let data = req.body;
        data.user = req.user.id;

        // If movie loaded in cookie, use that information. 
        if (req.cookies.movie) {
            console.log('The movie you have in your cookie is...' + req.cookies.movie.title);
            data = req.cookies.movie;
            data.review = req.body.review;    
            data.user = req.user.id;        
        }

        // Create entry
        let entry = await Entry.create(data);

        res
            .status(201)
            .cookie('movie', undefined, { expires: new Date(Date.now() +  2 * 1000)})
            .json({
                success: true, 
                data: entry
            });
    } catch (error) {
        next(error);
    }
}


// @Desc        Update a movie entry
// @Route       PUT /movielog/v1/entries/:id
// @Access      Private (only logged-in users)
exports.updateEntry = async (req, res, next) => {   
    try {
        // Check if entry exists
        let entry = await Entry.findById(req.params.id)
        if (!entry) {
            return next(new ErrorResponse(`Could not find entry with id ${req.params.id}`, 404));
        }

        // Update entry
        entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        });

        // Send back data
        res.status(200).json({
            success: true, 
            data: entry
        })
    } catch (error) {
        next(error);
    }
}

// @Desc        Delete a movie entry
// @Route       DELETE /movielog/v1/entries/:id
// @Access      Private (only logged-in users)
exports.deleteEntry = async (req, res, next) => {
    try {
        // Check if entry exists
        let entry = await Entry.findById(req.params.id);
        if (!entry) {
            return next(new ErrorResponse(`Could not find entry with id ${req.params.id}`, 404));
        }

        console.log(req.user.id);
        console.log(entry.user);

        // Check if user is owner of entry
        if (entry.user.toString() !== req.user.id) {
            return next(new ErrorResponse(`Not authorized to delete entry with ID ${req.params.id}`, 401));
        }

        // Delete enty
        await entry.remove();

        // Return successs
        res.status(200).json({
            success: true, 
            data: `Deleted entry with ID ${req.params.id}`
        });
    } catch (error) {
        next(error);
    }
}


