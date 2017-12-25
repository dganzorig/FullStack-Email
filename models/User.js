const mongoose = require('mongoose');
const { Schema } = mongoose;

// schema of each record within users collection
const userSchema = new Schema({
    googleId: String,
    credits: { type: Number, default: 0 }
});

// new collection w/ name + schema, ignore if exists
mongoose.model('users', userSchema);