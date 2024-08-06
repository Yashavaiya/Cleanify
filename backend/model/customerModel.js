const mongoose = require('mongoose');
const customerSchema= new mongoose.Schema({
                email : String,
                name : String,
                photo : String,
                address : String,
                phone : String, 
});

const Customer =new mongoose.model('Customer',customerSchema);
module.exports = Customer;





