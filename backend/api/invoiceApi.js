const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const invoiceController = require('../controller/invoiceController')


const invoiceURLPrefix = "/invoice/";
router.post(
    invoiceURLPrefix +"CreateInvoice",
    invoiceController.CreateInvoice
)
router.post(
    invoiceURLPrefix +"upload/:invoiceId",
    invoiceController.payments
)
router.get(
    invoiceURLPrefix +"GetPhoto/:filename",
    invoiceController.GetPhoto
)
router.get(
    invoiceURLPrefix +"ShowInvoice",
    invoiceController.getInvoice
)
router.get(
    invoiceURLPrefix +"ShowIndividualInvoice/:id",
    invoiceController.getIndividualData
)
router.put(
    invoiceURLPrefix +"updateInvoice/:id",
    invoiceController.UpdateInvoice
)
router.delete(
    invoiceURLPrefix +"deleteInvoice/:id",
    invoiceController.DeleteInvoice
)
router.get(
    invoiceURLPrefix +"SearchInvoice/:key",
    invoiceController.SearchingInvoice
)
module.exports = router;