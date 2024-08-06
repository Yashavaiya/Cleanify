const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//service model
const ServiceController = require('../controller/serviceController')

const ServiceURLPrefix = "/service/";

router.post(
    ServiceURLPrefix +"CreateService",
    ServiceController.CreateService
)

router.get(
    ServiceURLPrefix +"GetPhoto/:filename",
    ServiceController.GetPhoto
)
router.get(
    ServiceURLPrefix +"ShowService",
    ServiceController.getService
)
router.put(
    ServiceURLPrefix +"updateService/:id",
    ServiceController.UpdateService
)
router.delete(
    ServiceURLPrefix +"deleteService/:id",
    ServiceController.DeleteService
)
router.get(
    ServiceURLPrefix +"searchService/:key",
    ServiceController.SearchingService
)
router.get(
    ServiceURLPrefix +"ShowIndividualService/:id",
    ServiceController.getIndividualData
)
module.exports = router;

