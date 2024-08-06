const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();
const Service = require('../model/serviceModel')


// storage
const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: Storage
}).single('service_img')

exports.CreateService = (req, res) => {
    upload(req, res, (err) => {

        if (err) {
            console.log(err)
        } else {
            const newUser = new Service({
                name: req.body.name,
                services_img: req.file.filename,
                description: req.body.description,
                rate: req.body.rate,
            })
            console.log("filename", req.file.filename);
            newUser.save().then(result => {
                res.json({
                    status: "success",
                    message: "Upload successfully!"
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





// show the service details

exports.getService = async (req, res) => {
    // pagination (20)
    const { page, limit } = req.query;
    const skip = (page - 1) * 20;
    let ServiceData = await Service.find().skip(skip).limit(limit);
    res.send(ServiceData);
}

// show the individual customer data
exports.getIndividualData = async (req, res) => {
    try {
        const _id = req.params.id;
        const serviceData = await Service.findById(_id);
        if (!serviceData) {
            return res.status(404).send(error);
        } else {
            res.send(serviceData)
        }
    } catch (e) {
        res.send(e)
    }
}


exports.UpdateService = (req, res) => {
    const serviceId = req.params.id;

    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: "error",
                message: "Error uploading file"
            });
        } else {
            const updateFields = {
                name: req.body.name,
                description: req.body.description,
                rate: req.body.rate,
            };

            if (req.file) {
                updateFields.services_img = req.file.filename;
                console.log("filename", req.file.filename);
            }

            Service.findByIdAndUpdate(serviceId, updateFields, { new: true })
                .then(updatedService => {
                    if (!updatedService) {
                        return res.status(404).json({
                            status: "error",
                            message: "service not found"
                        });
                    }

                    res.json({
                        status: "success",
                        message: "service updated successfully",
                        service: updatedService
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        status: "error",
                        message: "Error updating service"
                    });
                });
        }
    });
}




// delete the service details

exports.DeleteService = async (req, res) => {
    try {
        const _id = req.params.id;
        const deleteService = await Service.findByIdAndDelete(_id);
        if (!_id) {
            return res.status(400).send("Id not exist in database")
        }
        res.send(deleteService)

    } catch (error) {
        res.status(400).send(error)
    }
}

// searching service details
exports.SearchingService = async (req, res) => {
    try {

        var search = '';
        if (req.params.key) {
            search = req.params.key
        }
        const ServiceData = await Service.find(
            {
                "$or": [
                    { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { rate: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { description: { $regex: '.*' + search + '.*', $options: 'i' } },
                ]
            }
        )
        res.send(ServiceData)
    } catch (error) {
        console.log("error:", error.message)
    }
}

