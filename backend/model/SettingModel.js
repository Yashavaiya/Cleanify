const mongoose = require('mongoose');
const settingSchema = new mongoose.Schema({
    user_email: String,
    password: String,
    host_name: String,
    tax: Number,
    port: Number
});



const setting = new mongoose.model('setting', settingSchema);
module.exports = setting;

