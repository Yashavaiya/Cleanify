const express = require('express');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const router = express.Router();
const setting = require('../model/SettingModel')

// create setting
exports.CreateSetting = (req, res) => {
    let { user_email, password, user_name, tax_id, port } = req.body;
    const user = new setting(req.body);
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    })
}

// show the setting details
exports.getSetting = async (req, res) => {
    let SettingData = await setting.find();
    res.send(SettingData);
}

// delete setting details
exports.DeleteSetting = async (req, res) => {
    try {
        const _id = req.params.id;
        const deleteSetting = await setting.findByIdAndDelete(_id);
        if (!_id) {
            return res.status(400).send("Id not exist in database")
        }
        res.status(200).send(deleteSetting)

    } catch (error) {
        res.status(400).send(error)
    }
}

// update setting details

exports.UpdateSetting = async (req, res) => {
    try {
        const _id = req.params.id;
        const updateSetting = await setting.findByIdAndUpdate(_id, req.body, { new: true });
        res.json({
            status: "success",
            message:"update setting successfully"
        })
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.getIndividualData = async (req, res) => {

        try {
            const _id = req.params.id;
            // console.log(req.params.id);
            const settingData = await setting.findById(_id);
            if (!settingData) {
                return res.status(404).send(error);
            } else {
                res.send(settingData)
            }
        } catch (e) {
            res.send(e)
        }
}

