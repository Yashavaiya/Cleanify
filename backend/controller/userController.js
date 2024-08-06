const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); 
const router = express.Router();
const User = require('../model/userModel')
const Setting = require('../model/SettingModel')

// mongodb user ForgetPassword model
const PasswordReset = require('../model/PasswordReset')

// import nodemailer
const nodemailer = require('nodemailer');

// var random = require('random-string-alphanumeric-generator');

// import uuid
// const { v4: uuidv4 } = require('uuid');

// password handler
const bcrypt = require('bcryptjs');




exports.UserRegistration = (req, res) => {
    let { email, password } = req.body;
  

    console.log("req.body:",req.body)
    email = email.trim();
    password = password.trim();
    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "empty inputs files"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short !"
        });
    } else {
        User.find({ email }).then(result => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with provided email are already exists"
                })
            } else {
                // create new user
                // password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        email,
                        password: hashedPassword,
                        verified: false
                    })
                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "SIGNUP SUCCESSFUL!"
                        })
                        console.log(result)

                    }).catch(err => {
                        console.log("Error : ", err)
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while saving user account!"
                        })
                    })
                })
            }
        }).catch((err, res) => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            })
        })
    }
}

// exports.UserRequestPasswordReset = (req, res) => {

//     const { email } = req.body;
// console.log("User :",User)
//     // check if email exists
//     User.find({ email })
//         .then((data) => {
//             console.log("data:",data)
//             if (data.length) {
//                 console.log("data.length:",data.length)
//                 // user exists
//                 sendResetEmail(data[0], res)
//             } else {
//                 return res.status(400).send("No account with the supplied email exists")
//             }
//         })
//         .catch(error => {
//             console.log(error)
//             return res.status(400).send("An error occurred while checking for existing user")
//         })
// }


exports.UserRequestPasswordReset = (req, res) => {
    const { email } = req.body;

    // Check if email exists
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).send("No account with the supplied email exists");
            }

            // User exists, call sendResetEmail function
            sendResetEmail(user, res);
        })
        .catch(error => {
            console.error("An error occurred while checking for existing user:", error);
            return res.status(500).send("An error occurred while checking for existing user");
        });
}





const sendResetEmail = async ({ _id, email },res) => {
    try {
        var settingData = await Setting.findOne();
        console.log("settingData:", settingData);

        if (settingData) {
            console.log("settingData.user_email:", settingData.user_email);
        } else {
            console.error("Setting data not found.");
            return res.status(500).send("Setting data not found");
        }
    } catch (error) {
        console.error("Error fetching setting data:", error);
        return res.status(500).send("Error fetching setting data");
    }
    const resetString = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
    console.log(resetString);


    // clearing existing reset records
    PasswordReset.deleteMany({ userId: _id })
        .then(result => {
            const transporter = nodemailer.createTransport({
                host: settingData.host_name,
                port: settingData.port,
                auth: {
                    user: settingData.user_email,
                    pass: settingData.password
                }
            });

            const mailOption = {
                from: settingData.user_email,
                to: email,
                subject: "password reset",
                html: ` <p> This is your OTP  <b>${resetString}</b> for resetPassword</p></p>`
            }

            // hash the reset string
            const saltRounds = 10;
            bcrypt.hash(resetString, saltRounds)
                .then(hashedResetString => {
                    // set values in password reset collection
                    const newPasswordReset = new PasswordReset({
                        userId: _id,
                        resetString: hashedResetString,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 3600000
                    });

                    newPasswordReset
                        .save()
                        .then(() => {
                            console.log("Mail Sending..")
                            transporter.sendMail(mailOption)
                                .then(() => {
                                    // reset email sent and password record saved
                                    res.json({
                                        status: "PENDING",
                                        message: "reset password email sent"
                                    })
                                })
                                .catch(error => {
                                    console.log(error);
                                    return res.status(400).send("password reset email failed")
                                })
                        })
                        .catch(error => {
                            console.log(error)
                            return res.status(400).send("Couldn't save password reset data!")
                        })
                }).catch(error => {
                    console.log(error);
                })
        })
        .catch(error => {
            // error while clearing existing records
            console.log(error);
            return res.status(400).send("clearing existing password reset records failed")
        })
}



exports.otpVerification = (req, res) => {
    var userId = null;
    let { email, resetString } = req.body;

    let userPromise = new Promise((resolve, reject) => {
        User.find({ email })
            .then((data) => {
                if (data.length > 0) {
                    userId = data[0]._id.toString()
                    resolve(userId)
                } else {
                    return res.status(400).send("No account with the supplied email exists")
                }
            })
            .catch(error => {
                console.log(error)
                return res.status(400).send("An error occurred while checking for existing user")
            })
    })

    userPromise.then((val) => {
        PasswordReset.find({ userId: val })
            .then(result => {
                if (result.length > 0) {
                    // password reset record and proceed

                    const { expiresAt } = result[0];
                    const hashedResetString = result[0].resetString;
                    // checking for expired reset string
                    if (expiresAt < Date.now()) {
                        PasswordReset
                            .deleteOne({ userId })
                            .then(() => {
                                // reset record deleted successfully
                                res.json({
                                    status: "FAILED",
                                    message: "password reset link  has expired "

                                })
                            })
                            .catch(error => {
                                // deletion failed
                                console.log(error)
                                return res.status(400).send("clearing password reset record failed")
                            })
                    } else {
                        //   valid reset record exists so validate the reset string
                        // compare the hashed  reset string
                        bcrypt.compare(resetString, hashedResetString)
                            .then((result) => {
                                if (result) {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "OTP Verified... "
                                    })
                                } else {
                                    // existing record but incorrect password reset string passed
                                    return res.status(400).send("Invalid password reset details passed")
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                return res.status(400).send("comparing password reset string failed")
                            })
                    }
                } else {
                    // password reset record doesn't exist
                    return res.status(400).send("Password reset request not found")
                }
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send("checking for existing password reset records failed")
            })
    }).catch((err) => {
        console.log('asynchronously executed: ' + err);
    });





}



exports.ResetPassword = (req, res) => {
    var userId = null;
    let { email, newPassword } = req.body;
    
    let resetPasswordPromise = new Promise((resolve, reject) => {
        User.find({ email })
            .then((data) => {
                if (data.length > 0) {
                    userId = data[0]._id.toString()
                    resolve(userId)
                } else {
                    return res.status(400).send("No account with the supplied email exists")
                }
            })
            .catch(error => {
                console.log(error)
                return res.status(400).send("An error occurred while checking for existing user")
            })
    })

    resetPasswordPromise.then((val)=>{
        PasswordReset.find({userId:val})
        .then(result => {
            if (result.length > 0) {
                // password reset record and proceed

                const { expiresAt } = result[0];
                const hashedResetString = result[0].resetString;
                // checking for expired reset string
                if (expiresAt < Date.now()) {
                    PasswordReset
                        .deleteOne({ userId })
                        .then(() => {
                            // reset record deleted successfully
                            res.json({
                                status: "FAILED",
                                message: "password reset link  has expired "

                            })
                        })
                        .catch(error => {
                            // deletion failed
                            console.log(error)
                            return res.status(400).send("clearing password reset record failed")
                        })
                } else {
                    //   valid reset record exists so validate the reset string
                    // compare the hashed  reset string
                    const saltRounds = 10;
                    bcrypt
                        .hash(newPassword, saltRounds)
                        .then(hashedNewPassword => {
                            // update user password
                            User.updateOne({ _id: userId }, { password: hashedNewPassword })
                                .then(() => {
                                    // delete reset records
                                    PasswordReset.deleteOne({ userId })
                                        .then(() => {
                                            // user and reset record updated

                                            res.json({
                                                status: "SUCCESS",
                                                message: "password reset successfully "
                                            })

                                        })
                                        .catch((error) => {
                                            console.log(error)
                                            res.json({
                                                status: "FAILED",
                                                message: "An error occurred while finalizing password reset "
                                            })
                                        })
                                })
                                .catch((error) => {
                                    console.log(error)
                                    res.json({
                                        status: "FAILED",
                                        message: "updating user password failed"
                                    })
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                            res.json({
                                status: "FAILED",
                                message: "An error occurred hashing a newPassword  "
                            })
                        })
                }
            } else {
                // password reset record doesn't exist
                return res.status(400).send("Password reset request not found")
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(400).send("checking for existing password reset records failed")
        })
}).catch((err) => {
    console.log('asynchronously executed: ' + err);
});
}


exports.UserSingIn = (req, res) => {
   

    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplies"
        })
    } else {
        // check if user exists
        User.find({ email })
            .then(data => {
                if (data.length) {
                    // user exists
                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if (result) {
                            res.json({
                                status: "success",
                                message: "sign in successfully"
                            })
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid password"
                            })
                        }
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while comparing  password"
                        })
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials entered "

                    })
                }
            }).catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user"
                })
            })

    }
}
