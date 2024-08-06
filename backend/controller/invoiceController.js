const express = require('express');
const mongoose = require('mongoose');
// const mongodb = require('mongodb');
const moment = require('moment');
const multer = require('multer');
const router = express.Router();
// const today = moment();
const Invoice = require('../model/invoiceModel');

exports.CreateInvoice = async (req, res) => {
    var invoiceNumber = await this.createInvoiceNumber();
    let date = await new Date().toISOString().slice(0, 10);

    let  { invoice_number, bill_id, customer_Id, invoice_date, service_date, hours, service_Id, amount, amount_with_tax, pdf, payment_status, payment_image, total_amount } = req.body;

    //  save the data database
    req.body.invoice_number = invoiceNumber;
    req.body.invoice_date = date;

    // create Invoice 
    const user = new Invoice(req.body);
    user.save().then(() => {
        res.json({
            status: "success",
            message: "Create Invoice successfully"
        })
    }).catch((error) => {
        res.status(400).send(error)
    })
}

// storage
const Storage = multer.diskStorage({
    destination: "Payment SS",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: Storage
})


exports.payments = async (req, res) => {
    const invoiceId = req.params.invoiceId;

    try {

        upload.single('photo')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: 'File upload error' });
            } else if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Access the uploaded file information using req.file
            const uploadedFile = req.file;

            if (!uploadedFile) {
                return res.status(400).json({ error: 'Please upload an image' });
            }

            // Update the payment status to "paid" in the database
            const updatedInvoice = await Invoice.findByIdAndUpdate(
                invoiceId,
                {
                    payment_status: 'paid',
                    payment_image: uploadedFile ? uploadedFile.filename : null
                },
                { new: true }
            ).exec();

            if (!updatedInvoice) {
                return res.status(404).json({ error: 'Invoice not found' });
            }

            res.json({ message: 'Payment status updated to paid', uploadedImage: uploadedFile ? uploadedFile.filename : null });
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.GetPhoto = (req, res) => {
    const filename = req.params.filename;

    // Assuming you store uploaded photos in the 'uploads/' folder
    res.sendFile(`E:/serviceinvoicing/Backend/Payment SS/${filename}`, { headers: { 'Content-Type': 'image/jpeg' } });
};









// show the invoice details
exports.getInvoice = async (req, res) => {
    // pagination (20)
    const { page, limit } = req.query;
    const skip = (page - 1) * 20;
    let InvoiceData = await Invoice.find().skip(skip).limit(limit);
    res.send(InvoiceData);
}



// update the invoice details

exports.UpdateInvoice = async (req, res) => {
    try {
        const _id = req.params.id;
        const updateInvoice = await Invoice.findByIdAndUpdate(_id, req.body, { new: true });
        res.json({
            status: "success",
            message: "update Invoice successfully"
        })
    } catch (error) {
        res.status(400).send(error)
    }
}

// delete the invoice details

exports.DeleteInvoice = async (req, res) => {
    try {
        const _id = req.params.id;
        const deleteInvoice = await Invoice.findByIdAndDelete(_id);
        if (!_id) {
            return res.status(400).send("Id not exist in database")
        }
        res.send(deleteInvoice)

    } catch (error) {
        res.status(400).send(error)
    }
}

// searching invoice details
exports.SearchingInvoice = async (req, res) => {
    try {

        var search = '';
        if (req.params.key) {
            search = req.params.key
        }
        const invoiceData = await Invoice.find(
            {
                "$or": [
                    { invoice_number: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { invoice_date: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { service_date: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { total_amount: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { payment_status: { $regex: '.*' + search + '.*', $options: 'i' } },






                ]
            }
        )
        res.send(invoiceData)
    } catch (error) {
        console.log("error:", error.message)
    }
}

exports.getIndividualData = async (req, res) => {
    try {
        const _id = req.params.id;
        // console.log(req.params.id);
        const invoiceData = await Invoice.findById(_id);
        if (!invoiceData) {
            return res.status(404).send(error);
        } else {
            res.send(invoiceData)
        }
    } catch (e) {
        res.send(e)
    }
}



exports.createInvoiceNumber = async () => {
    return new Promise((resolve, reject) => {
        Invoice.findOne().sort({ field: 'asc', _id: -1 }).limit(1).then(function (res, err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                try {

                    let invoice_number = res ? res.invoice_number : null;

                    // console.log("invoice_number :",invoice_number)

                    // get the current date
                    let InvoiceNumber = 1;
                    let formattedInvoiceNumber = "";
                    const today = moment();

                    if (invoice_number == null || invoice_number == "") {
                        formattedInvoiceNumber = InvoiceNumber + "/" + today.year()
                    } else {
                        // check if it's April 1st 
                        if (today.month() === 3 && today.date() === 1) {
                            formattedInvoiceNumber = InvoiceNumber + "/" + today.year()
                        } else {
                            let splitInvoiceNumber = invoice_number.split(" ")[0];
                            formattedInvoiceNumber = parseInt(splitInvoiceNumber) + InvoiceNumber + "/" + today.year()
                        }

                    }
                    console.log("formattedInvoiceNumber : ", formattedInvoiceNumber)
                    resolve(formattedInvoiceNumber);

                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            }
        });
    });
};






