const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
var pdf = require("pdf-creator-node");
const fs = require('fs');
const Invoice = require('../model/invoiceModel')
const Customer = require('../model/customerModel')
const setting = require('../model/SettingModel')
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());


const fsPromises = require('fs').promises;
const path = require('path');
const { ReturnDocument } = require('mongodb');

router.get('/invoice/:id', async (req, res, next) => {
    const invoiceId = req.params.id;

    try {
        const invoiceData = await Invoice.findById(invoiceId).exec();
        console.log("invoiceData: ", invoiceData);

        if (!invoiceData) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const customerData = await Customer.findById(invoiceData.customer_Id).exec();

        if (!customerData) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const settingData = await setting.findById(invoiceData.setting_Id).exec();
        console.log("settingData: ", settingData);

        if (!settingData) {
            return res.status(404).json({ error: 'Setting not found' });
        }

        // Specify the folder path
        const folderPath = path.join(__dirname, '../invoices');

        // Ensure the folder exists, create it if it doesn't
        await fsPromises.mkdir(folderPath, { recursive: true });
        const templateHtml = await fsPromises.readFile('template.html', 'utf8');

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
        };

        const document = {
            html: templateHtml,
            data: {
                ...invoiceData.toObject(),
                customer: customerData.toObject(),
                setting: settingData.toObject()
            },
            // Specify the full path for the PDF file
            path: path.join(folderPath, `invoice_${invoiceData._id}.pdf`),
        };

        // Generate the PDF
        await pdf.create(document, options);

        console.log("settingData.user_email:", settingData.user_email);

        const transporter = nodemailer.createTransport({
            host: settingData.host_name,
            port: settingData.port,
            auth: {
                user: settingData.user_email,
                pass: settingData.password
            }
        });

        console.log("customerData.email", customerData.email);

        // Send email with the generated PDF attached
        const mailOptions = {
            from: settingData.user_email,
            to: customerData.email,
            subject: 'Invoice and payment information',
            html: `<p style="font-size: 20px;">Dear <b>${customerData.name}</b>,<br><br>Attached to this mail, you will find the invoice <b>(${invoiceData.invoice_number})</b> for the service provided to you,
                <br><br>
                </p><p style="font-size: 20px;"> To complete your payment, please <a href="http://localhost:4200/payment/${invoiceData._id}">click here</a> to upload the payment photo.
                </p>`,
            attachments: [
                {
                    filename: `invoice_${invoiceData._id}.pdf`,
                    path: document.path,
                },
            ],
        };

        
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent:', info.response);

        res.status(200).json({ message: 'Invoice sent successfully!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports = router;