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

