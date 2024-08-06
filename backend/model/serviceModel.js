const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
                name : String,
                services_img : String,
                description : String,
                rate : String,
});



const service =new mongoose.model('service',serviceSchema);
module.exports = service;