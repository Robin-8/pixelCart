const path = require("path");
const logger = require('morgan');
const express = require("express");
const app = express();
const session = require("express-session");
const nocache=require('nocache');

const config = require("./config/config");
const mongooseDb = require('../config/connection') 

mongooseDb()

app.use(session({ secret: config.sessionSecret, saveUninitialized: true, resave: false }));

app.use(express.static(path.join(__dirname, 'public')));




app.use(nocache());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'hbs');


//for user routes
const userRoute = require('./routes/index');
app.use('/', userRoute);

//for admin routes
const adminRoute = require('./routes/admin');
app.use('/admin', adminRoute);

app.listen(3000, function () {
    console.log("Server is running 3000");
});

module.exports = app;