const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const userController = require('../controller/userController')

const userURLPrefix = "/user/";

router.post(
    userURLPrefix + "signup",
    userController.UserRegistration
);

router.post(
    userURLPrefix + "signin",
    userController.UserSingIn
);
router.post(
    userURLPrefix + "requestPasswordReset",
    userController.UserRequestPasswordReset
);

router.post(
    userURLPrefix + "resetPassword",
    userController.ResetPassword
)

router.post(
    userURLPrefix + "otpVerification",
    userController.otpVerification
)

module.exports = router;

