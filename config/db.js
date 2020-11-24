const mongoose = require('mongoose');

let connectDB = async function(){
    let conn =  await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser : true, 
        useCreateIndex : true, 
        useFindAndModify : false, 
        useUnifiedTopology : true
    }); 

    console.log(`Connection running, sir at ${conn.connection.host}.`.cyan.underline.bold);
}

module.exports = connectDB; 