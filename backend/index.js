const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = require('express')();
const port = process.env.PORT;

const bodyParser = require('express').json;


// Connecting to database
mongoose.connect('mongodb://localhost:27017', { family: 4 })

	.then(() => {
		console.log("DB connected")
	}).catch((error) => {
		console.log(error)
	}) 

app.use(bodyParser());

app.use(cors({ origin: true, credentials: true, methods: 'POST,GET,PUT,OPTIONS,DELETE' }));

var userEndpoints = require("./api/userAPI");
var CustomerEndpoints = require("./api/customerApi");
var serviceEndpoints = require("./api/serviceApi");
var settingEndpoints = require('./api/SettingApi');
var invoiceEndpoints = require('./api/invoiceApi')
var PdfCreateEndpoints = require('./api/pdfApi')


app.use(process.env.BASE_URL, userEndpoints);
app.use(process.env.BASE_URL, CustomerEndpoints);
app.use(process.env.BASE_URL, serviceEndpoints);
app.use(process.env.BASE_URL, settingEndpoints);
app.use(process.env.BASE_URL, invoiceEndpoints);
app.use(process.env.BASE_URL, PdfCreateEndpoints);
app.listen(port, () => {
	console.log(`server running on ${port}`);
})










