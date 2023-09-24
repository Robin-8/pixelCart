const hbs = require('hbs'); // Require the 'hbs' package
const path = require("path");
const logger = require('morgan');
const express = require("express");
const app = express();
const session = require("express-session");
const nocache=require('nocache');
const dotenv=require('dotenv').config();

const config = require("./config/config");
const mongooseDb = require('../config/connection')  

mongooseDb()

app.set('views',path.join(__dirname,'views'))
app.set('view engine' , 'hbs')
app.set('users' , path.join(__dirname,'views/user'))
app.set('admin' , path.join(__dirname,'views/admin'))


app.use(session({ secret: config.sessionSecret, saveUninitialized: true, resave: false }));

app.use(express.static(path.join(__dirname, 'public')));




app.use(nocache());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


hbs.registerHelper('selectFirst', function(array) {
    if (Array.isArray(array) && array.length > 0) {
      return array[0];
    }
    // Handle the case where the array is empty or not an array
    return array;
  });

//for user routes
const userRoute = require('./routes/index');
app.use('/', userRoute);

//for admin routes
const adminRoute = require('./routes/admin');
app.use('/admin', adminRoute);

app.listen(3001, function () {
    console.log("Server is running 3001");
});

module.exports = app;