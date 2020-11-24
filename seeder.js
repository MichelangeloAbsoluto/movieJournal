const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

// Load models
const Entry = require('./models/Entry');
const User = require('./models/User');

// Open connection to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: true, 
    useUnifiedTopology: true
});

// Read JSON files with all the data
const seedUsers = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const seedEntries = JSON.parse(fs.readFileSync(`${__dirname}/_data/entries.json`, 'utf-8'));

// Import data into database 
const importData =  async function() {
    try {
        await User.create(seedUsers);
        await Entry.create(seedEntries);
        console.log('Importing data...')
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

// Delete data from database 
const deleteData = async function() {
    try {
        await User.deleteMany();
        await Entry.deleteMany();
        console.log('Deleting data...');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}


if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d'){
    deleteData();
}