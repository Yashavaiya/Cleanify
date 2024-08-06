const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    
});


module.exports = mongoose.model(
    'user', UserSchema, 'Users');




