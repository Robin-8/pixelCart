const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');

const profileHelper = require('../helpers/profileHelper')
const auth = require('../middilwere/userAuth')
const profileController = require('../controllers/profileController')
const orderController = require('../controllers/orderController')
const wishListController = require('../controllers/wishListController')
const varificationController = require('../controllers/varificationController')


const {successOrder}=require('../controllers/orderController')

router.use(express.static('public'))


router.get('/', userController.landingPage)

router.post('/verify', userController.verify)
router.post('/verifys', userController.verifys)

router.post('/signup', userController.signup)

router.get('/login', userController.login)
router.post('/login', userController.getuserlogin)

router.get('/home', userController.home)

router.get('/logout', userController.logout)

router.get('/productdetails/:id', userController.getProductDetails)
// router.post('/resetpassword',varificationController.resetUserPassword)
// router.get ('/forgetPassword',varificationController.forgotPassword)
// router.get('/reset-password/:token',varificationController.resetPassword)
// router.get('/resetpassword',varificationController.resetPassword)



router.get('/addToCart/:id', cartController.addToCart)
router.get('/carts', cartController.getCart)
router.post('/changeProuductQuantity', cartController.changeQuantity)
router.get('/removeCartProduct', cartController.removeCartProduct)
router.get('/deleteCart',cartController.deleteCart)

router.get('/addAddress', profileController.addAddress)
router.post('/addNewAddress', profileController.addNewAddress)
router.get('/manageAddress', profileController.manageAddress)
router.get('/userDetails', profileController.userDetails)                       
router.get('/editAddress', profileController.editAddress)
router.post('/editAddress', profileController.updateAddress)
router.get('/deleteAddress', profileController.deleteAddress)


router.get('/addToWishList/:id', wishListController.addToWishlist)


router.get('/getProfilePage', profileController.getUserProfilePage)
router.post('/changePrimaryAddress', profileController.changePrimaryAddress)
router.post('/checkout', orderController.checkOut)
router.post('/addresscheckout', profileController.addresscheckout)
router.get('/orderSuccess',userController.orderSuccess)
router.get('/placeOrder', orderController.placeOrder)
router.post('/verifyPayment',orderController.varifyPayments)
router.get('/successOrder',successOrder)
router.get('/orderDetails',orderController.orderDetails)
router.post('/cancel-order:orderId',orderController.cancelOrder)
router.get('/razorpay',userController.razorpay)
module.exports = router;
