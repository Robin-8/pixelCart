const hbs = require('hbs');
const path = require("path");
const logger = require('morgan');
const express = require("express");
const app = express();
const session = require("express-session");
const nocache = require('nocache');
const dotenv = require('dotenv').config();
const exphbs = require('express-handlebars');
const helpers = require('./helpers/handleBarHelper'); // Include the helpers module

const config = require("./config/config");
const mongooseDb = require('../config/connection');

mongooseDb();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.set('users', path.join(__dirname, 'views/user'))
app.set('admin', path.join(__dirname, 'views/admin'))

// app.use(express.static(path.join(__dirname, 'views/partials')))
hbs.registerPartials(__dirname + '/views/partials');
app.use(session({ secret: config.sessionSecret, saveUninitialized: true, resave: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use(nocache());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

hbs.registerHelper('selectFirst', function (array) {
  if (Array.isArray(array) && array.length > 0) {
    return array[0];
  }
  // Handle the case where the array is empty or not an array
  return array;
});

hbs.registerHelper('formatPrice', function (price) {
  return (
    "₹" + Number(price).toLocaleString("en-IN", { maximumFractionDigits: 2 })
);
});

// For user routes
const userRoute = require('./routes/index');
app.use('/', userRoute);

// For admin routes
const adminRoute = require('./routes/admin');
app.use('/admin', adminRoute);

app.listen(3001, function () {
  console.log("Server is running on port 3001");
});

module.exports = app;
