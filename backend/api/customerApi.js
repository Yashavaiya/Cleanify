
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const CustomerController = require('../controller/customerController')

const CustomerURLPrefix = "/customer/";

router.post(
    CustomerURLPrefix +"CreateCustomer",
    CustomerController.CreateCustomer
)
router.get(
    CustomerURLPrefix +"ShowCustomer",
    CustomerController.getCustomer
)
router.get(
    CustomerURLPrefix +"GetPhoto/:filename",
    CustomerController.GetPhoto
)
router.get(
    CustomerURLPrefix +"ShowIndividualCustomer/:id",
    CustomerController.getIndividualData
)
router.get(
    CustomerURLPrefix +"getCustomerDetails/:id",
    CustomerController.getCustomerDetails
)
router.put(
    CustomerURLPrefix +"updateCustomer/:id",
    CustomerController.UpdateCustomer
)
router.delete(
    CustomerURLPrefix +"deleteCustomer/:id",
    CustomerController.DeleteCustomer
)
router.get(
    CustomerURLPrefix +"searchCustomer/:key",
    CustomerController.SearchingCustomer
)

module.exports = router;