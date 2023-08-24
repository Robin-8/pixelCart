const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/',userController.landingPage)

router.post('/verify',userController.verify)
router.post('/verifys',userController.verifys)

router.post('/signup',userController.signup)

router.get('/login',userController.login)
router.post('/login',userController.getuserlogin)

router.get('/home',userController.home)

router.get('/logout',userController.logout)

router.get('/productdetails/:id',userController.getProductDetails)

module.exports = router;
