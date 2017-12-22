const mongoose = require('mongoose');
const { Schema } = mongoose;

// schema of each record within users collection
const userSchema = new Schema({
    googleId: String
});

// new collection w/ name + schema, ignore if exists
mongoose.model('users', userSchema);