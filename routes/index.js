
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
const couponController = require('../controllers/couponController')


const { successOrder } = require('../controllers/orderController')

router.use(express.static('public'))


router.get('/', userController.landingPage)

router.post('/verify', userController.verify)
router.post('/verifys', userController.verifys)

router.post('/signup', userController.signup)

router.get('/login', userController.login)
router.post('/login', userController.getuserlogin)

router.get('/home', auth.isLogin,userController.home)
router.get('/productList', auth.isLogin,userController.productListing)

router.get('/logout',auth.isLogin,userController.logout)

router.get('/productdetails/:id', userController.getProductDetails)

router.get('/forgotPassword',varificationController.forgotPassword)
router.get('/reset-password/:token',varificationController.resetPassword)
router.get('/reset-password',varificationController.resetPassword)
router.post('/reset-password',varificationController.resetUserPassword)



router.get('/addToCart/:id',auth.isLogin, cartController.addToCart)
router.get('/carts', auth.isLogin,cartController.getCart)
router.get('/checkStock',orderController.checkStock)
router.post('/changeProuductQuantity', cartController.changeQuantity)
 router.get('/removeCartProduct', cartController.removeCartProduct)
router.get('/deleteCart', cartController.deleteCart)



router.get('/addAddress',auth.isLogin, profileController.addAddress)
router.post('/addNewAddress', auth.isLogin,profileController.addNewAddress)
router.get('/manageAddress', profileController.manageAddress)
router.get('/userDetails', auth.isLogin,profileController.userDetails)
router.get('/editAddress',auth.isLogin, profileController.editAddress)
router.post('/editAddress',auth.isLogin, profileController.updateAddress)
router.get('/deleteAddress', auth.isLogin,profileController.deleteAddress)


router.get('/addToWishList/:id', wishListController.addToWishlist)


router.get('/getProfilePage',auth.isLogin, profileController.getUserProfilePage)
router.post('/changePrimaryAddress',auth.isLogin, profileController.changePrimaryAddress)
router.post('/checkout',auth.isLogin, orderController.checkOut)
router.post('/addresscheckout', profileController.addresscheckout)
router.get('/orderSuccess', userController.orderSuccess)
router.get('/placeOrder', auth.isLogin,orderController.placeOrder)
router.post('/verifyPayment', orderController.varifyPayments)
router.get('/successOrder', successOrder)
router.get('/orderDetails', auth.isLogin,orderController.orderDetails)
router.get('/cancel-order',auth.isLogin, orderController.cancelOrder)
router.get('/razorpay', auth.isLogin,userController.razorpay)


// couponss


router.get('/getCoupons', couponController.userGetCoupon)
router.post('/user_applaycoupon', couponController.userApplayCoupon)

router.get('/getCoupon/:couponId', couponController.getCoupon)


//for filltering the product

router.post('/filterProduct',userController.fillterProduct)
module.exports = router;
