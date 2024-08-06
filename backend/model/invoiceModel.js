const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    invoice_number: String,
    invoice_date: String,
    service_date: String,
    customer_Id: {
        type: String,
        ref: 'Customer',
    },
    service: Array,
    setting_Id:String,
    tax:Number,
    tax_amount:String,
    total_amount: String,
    payment_status: { type: String, default: 'unpaid' },
    payment_image:String
});

const invoice = new mongoose.model('invoice', invoiceSchema);


// Exporting our model objects
module.exports = invoice;
