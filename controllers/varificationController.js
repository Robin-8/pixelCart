const mongoose = require('mongoose')
const jwt= require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const userHelper = require('../helpers/user-helpers')
const profileHelper = require ('../helpers/profileHelper')
const randomstring = require('randomstring')
const bcrypt = require('bcrypt')
const { error } = require('console')
const async = require('hbs/lib/async')

// const emailTokens = {};
// const jwtSecret = crypto.randomBytes(32).toString('hex');

// const email = 'robinshaji888@gmail.com'

// const forgotPassword=(async(req,res)=>{    
//     const useremail = req.query.email
//     console.log(email,'chkkkk emaillllll')
//     const user=await userHelper.getUserEmail(useremail)

//     if(!user){
//         res.json({ message: 'user not found' });
//     }
//     else{

// // const secretKey = 'yourSecretKey'; // Replace with your secret key
// const token = jwt.sign({ email }, jwtSecret, { expiresIn: '60s' });
//  emailTokens[email] = token;

// console.log( token,'Generated token:');


// const transporter = nodemailer.createTransport({
//   service: 'Gmail', // or your email service provider    jdIMCw4eTcDWYVsKE7aB851vvFuE33
//   auth: {
//     user: 'robinshaji888@gmail.com', // replace with your email
//     pass: 'hbtgyclfdywlatnt' // replace with your password or app password
//   }
// });

// const mailOptions = {
//   from: 'robinshaji888@gmail.com',
//   to: useremail,
//   subject: 'Password Reset',
//   text:  `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`
// };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         // console.error(error);
//         res.status(500).json({ message: 'Error sending email' });
//     } else {
//         // console.log('Email sent: ' + info.response);
       
//        console.log( req.query.email,'chkkk inside emaillllllll')
//         req.session.email=req.query.email
//         res.json({ message: 'Email sent for password reset' });
//     }
//   });
//  }
// });


// const resetUserPassword = async(req,res)=>{
//     const email = req.session.email
     
//     const updatedPassword = req.body.password
//     console.log(updatedPassword,'here is updated password');
//     const update = await profileHelper.updatePassword(updatedPassword,email)
//     if(update){
//       console.log(update,'updated password here');
//       res.redirect('/login')
//     }
// }



// module.exports = {
//     forgotPassword,
//     resetPassword,
//     resetUserPassword
// }