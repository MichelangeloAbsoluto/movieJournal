const mongoose = require('mongoose');

// THINGS TO ADD
// Average rating based on all entries with this title
// User who is owner of entry
// Callback to properly store cast which will be given "Tom Hanks, Rita Wilson, Brad Pitt" 

const EntrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a movie title'],
        unique: false,
        trim: true,
        lowercase: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
      },
    year: {
        type: Number,
        required: true,
        min: 1888,
        max: 2021,
      },
    genre: {
        type: String,
        maxlength: [100, 'Genre cannot be more than 50 characters']
      },
    director: {
        type: String,
        trim: true, 
        lowercase: true,
        maxlength: [200, 'Director cannot be longer than 50 characters']
      },
    writer: {
        type: String,
        trim: true, 
        lowercase: true,
        maxlength: [200, 'Writer cannot be longer than 50 characters']
      },
    plot: {
        type: String,
        maxlength: [2000, 'Plot descrciption cannot be longer than 1000 characters']
    },
    cast: {
         // Array of strings
         type: [String],
         required: true
    },
    metascore: {
        type: Number,
        required: [true, 'Please add a metascore'],
        min: 0,
        max: 100
      },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    review: {
        type: String,
        required: true,
        maxlength: [3000, 'Review cannot be more than 3000 characters']
    },
    user: {
      type : mongoose.Schema.ObjectId,
      ref : 'User',
      required : true
  }
});

// -- MIDDLWARE -- //


module.exports = mongoose.model('Entry', EntrySchema);

