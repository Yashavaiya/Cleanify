
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();
const Customer = require('../model/customerModel');
const Invoice = require('../model/invoiceModel')
// const { file, image } = require('pdfkit');

// storage
const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: Storage
}).single('photo')

exports.CreateCustomer = (req, res) => {
    upload(req, res, (err) => {

        if (err) {
            console.log(err)
        } else {
            const newUser = new Customer({
                email: req.body.email,
                name: req.body.name,
                photo: req.file.filename,
                address: req.body.address,
                phone: req.body.phone

            })
            console.log("filename", req.file.filename);
            newUser.save().then(result => {
                res.json({
                    status: "success",
                    message: "Create customer successfully!"
                })
                console.log(result)

            }).catch(err => console.log(err));
        }
    })
}


exports.GetPhoto = (req, res) => {
    const filename = req.params.filename;

    // Assuming you store uploaded photos in the 'uploads/' folder
    res.sendFile(`E:/angular project/backend/uploads/${filename}`, { headers: { 'Content-Type': 'image/jpeg' } });
};



exports.getCustomer = async (req, res) => {
    // pagination (20)
    const { page, limit } = req.query;
    const skip = (page - 1) * 20;

    let CustomerData = await Customer.find().skip(skip).limit(limit);
    res.send(CustomerData);

}


exports.getIndividualData = async (req, res) => {
    try {
        const _id = req.params.id;
        // console.log(req.params.id);
        const customerData = await Customer.findById(_id);
        if (!customerData) {
            return res.status(404).send(error);
        } else {
            res.send(customerData)
        }
    } catch (e) {
        res.send(e)
    }
}

exports.getCustomerDetails = async (req, res) => {
    try {
        customerId = req.params.id;


        const customerData = await Customer.findById(customerId);
        if (!customerData) {
            return res.status(404).send(error);
        } else {
        }


        // Get total amount of service
        const totalAmountService = await Invoice.aggregate([
            {
                $match: { customer_Id: customerId },
            },
            {
                $group: {
                    _id: null,
                    totalAmountService: { $sum: { $toDouble: '$total_amount' } },
                },
            },
        ]);

        // get the unpaid amount total
        const totalAmountUnpaidResult = await Invoice.aggregate([
            {
                $match: { customer_Id: customerId, payment_status: 'unpaid' },
            },
            {
                $group: {
                    _id: null,
                    totalAmountUnpaid: { $sum: { $toDouble: '$total_amount' } },
                },
            },
        ]);
        const totalAmountUnpaid = totalAmountUnpaidResult.length > 0 ? totalAmountUnpaidResult[0].totalAmountUnpaid : 0;
        console.log("totalAmountUnpaid:", totalAmountUnpaid)


        //   get the paid amount total 
        const totalAmountPaidResult = await Invoice.aggregate([
            {
                $match: { customer_Id: customerId, payment_status: 'paid' },
            },
            {
                $group: {
                    _id: null,
                    totalAmountPaid: { $sum: { $toDouble: '$total_amount' } },
                },
            },
        ]);
        const totalAmountPaid = totalAmountPaidResult.length > 0 ? totalAmountPaidResult[0].totalAmountPaid : 0;
        console.log("totalAmountPaid;", totalAmountPaid);

        // Get list of all invoices
        const invoices = await Invoice.find({ customer_Id: customerId });

        res.send({
            CustomerData: customerData,
            totalAmountService: totalAmountService.length > 0 ? totalAmountService[0].totalAmountService : 0,
            totalAmountPaid: totalAmountPaid || 0,
            totalAmountUnpaid: totalAmountUnpaid || 0,
            invoices,
        });
    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
}




exports.UpdateCustomer = (req, res) => {
    const customerId = req.params.id; // Assuming you have the customer ID in the request parameters

    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: "error",
                message: "Error uploading file"
            });
        } else {
            const updateFields = {
                email: req.body.email,
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone
            };

            if (req.file) {
                updateFields.photo = req.file.filename;
                console.log("filename", req.file.filename);
            }

            Customer.findByIdAndUpdate(customerId, updateFields, { new: true })
                .then(updatedCustomer => {
                    if (!updatedCustomer) {
                        return res.status(404).json({
                            status: "error",
                            message: "Customer not found"
                        });
                    }

                    res.json({
                        status: "success",
                        message: "Customer updated successfully",
                        customer: updatedCustomer
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        status: "error",
                        message: "Error updating customer"
                    });
                });
        }
    });
}

exports.DeleteCustomer = async (req, res) => {
    try {
        const _id = req.params.id;
        const deleteCustomer = await Customer.findByIdAndDelete(_id);
        if (!_id) {
            return res.status(400).send("Id not exist in database")
        }
        res.json({
            status: "success",
            message: "Customer Delete successfully",
            customer: deleteCustomer
        });

    } catch (error) {
        res.status(400).send(error)
    }
}



exports.SearchingCustomer = async (req, res) => {

    try {

        var search = '';
        if (req.params.key) {
            search = req.params.key
        }
        const customerData = await Customer.find(
            {
                "$or": [
                    { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { address: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { phone: { $regex: '.*' + search + '.*', $options: 'i' } },




                ]
            }
        )
        res.send(customerData)
    } catch (error) {
        console.log("error:", error.message)
    }


}