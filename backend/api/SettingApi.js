const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Setting model
const settingController= require('../controller/SettingController')
const SettingURLPrefix = "/setting/";

router.post(
    SettingURLPrefix +"CreateSetting",
    settingController.CreateSetting
)
router.get(
    SettingURLPrefix +"ShowSetting",
    settingController.getSetting
)
router.put(
    SettingURLPrefix +"updateSetting/:id",    
    settingController.UpdateSetting
)
router.delete(
    SettingURLPrefix +"deleteSetting/:id",
    settingController.DeleteSetting
)
router.get(
    SettingURLPrefix +"showindividualSetting/:id",
    settingController.getIndividualData
)


module.exports = router;