// -- IMPORTS -- //
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Schema 
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        required: [true, 'Please add an email'],
        unique: true 
      },
      role: {
          type: String, 
          enum: ['user', 'admin'],
          default: 'user'
      },
      password: {
          type: String, 
          required: [true, 'Please add a password'],
          minlength: 6,
          select: false
      },
      resetPasswordToken: String, 
      resetPasswordExpire: Date, 
      createdAt: {
          type: Date, 
          default: Date.now
      }
}, {
    toJSON : { virtuals : true },
    toObject : { virtuals : true }
  });

// Create entries field that auto-populates with entries owned by the user
// Select field where two will match ... user.id === entry.user
UserSchema.virtual('entries', {
    ref : 'Entry',
    localField : '_id',
    foreignField : 'user',
    justOne : false
});

// Remove associated entries if user is deleted.
UserSchema.pre('remove', async function(next){
    console.log(`Removing entries by user ${this.name}.`);
    // Go into Entry model & Delete all entries where user === this._id.
    await this.model('Entry').deleteMany( { user: this._id} );
    next();
})

// Salts & encrypts password
UserSchema.pre('save', async function(next) {
    // If password was NOT modfified, skip.
    if(!this.isModified('password')){
        next();
    }
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Create signed webtoken, return to user. 
//  TOKEN = jwt.sign( { PAYLOAD }, SECRET, { OPTIONS } )
// We sign the token with the an encrypted version of the user's unique id
// The token.id property is now a user's id, but encrypted.
// Later we can decode with token.id prop and get the id of a User
UserSchema.methods.getSignedJstToken = function(){
    let token = jwt.sign( { id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_DATE});
    return token;
}

// match password
UserSchema.methods.matchPassword = async function(enteredPassword){
    let isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
}

UserSchema.methods.getResetPasswordToken = function(){
    // Generate token with crypto 
    const resetToken = crypto.randomBytes(10).toString('hex');

    // Hash the reset token & store it on user object
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire to 10 minutes
    this.resetPasswordExpire = Date.now() + 1000 * 60 * 10;

    // Return un-hashed reset token.
    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
