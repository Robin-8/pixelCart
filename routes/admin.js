const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController')
const upload = require('../helpers/multer');
const { route } = require('.');
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController')
const bannerController = require("../controllers/bannerController")
const auth = require('../middilwere/adminAuth');
const adminReportController = require("../controllers/adminReportController")






router.get('/',adminController.dashbord )


router.post('/admin-login',adminController.verifyAdmin) 

router.get('/productListing',adminController.getProductListing)


router.get('/add-product',auth.isLogin,adminController.adminAddProductPage)
router.post('/add-product',upload.array('Images',4),adminController.adminAddProduct)






router.get('/admineditproduct',auth.isLogin,adminController.adminGetProduct)
router.post('/edit-product/:id',upload.array('Images',4),adminController.adminEditProduct)

router.get('/admindeleteproduct',auth.isLogin,adminController.adminDeleteProduct)
router.get('/recoverdeletproduct',adminController.adminRecoverDeletePrdt)

router.get('/adminblock_user',auth.isLogin,adminController.adminBlockUser)
router.get('/adminUn_block_user',auth.isLogin,adminController.adminUnBlockUser)
router.get('/admindeleteuser',auth.isLogin,adminController.adminDeleteUser)

router.get('/allUsers',auth.isLogin,adminController.getAllUsers )
router.get('/allCategory',auth.isLogin,categoryController.getAllCategory)
router.get('/adminViewOrderDetails',auth.isLogin,orderController.getOrderDetails)


router.get('/addCategory',auth.isLogin,categoryController.loadCategory)
router.post('/addCategory',auth.isLogin,categoryController.createCategory)

// for admin dashbord 

// router.get('/adminDashbord',auth.isLogin,adminController.Dashbord)
// router.get('/dashbord',adminController.Daashbord)
//for edit and delete category 

router.get('/editCategory/:categoryId',auth.isLogin, categoryController.getEditCategory);
router.post('/admincat-edit/:categoryId',auth.isLogin, categoryController.postEditCategory);
router.post('/deleteCategory/:categoryId',auth.isLogin, categoryController.deleteCategory);




router.get('/admin-orderList',auth.isLogin,orderController.adminOrderDtails)
router.post('/admin/update-order-status/:orderId',auth.isLogin,orderController.statusUpdateOrder)
router.get('/productDetails/:orderId',auth.isLogin,orderController.adminOrderDetails)




//-------------------status changing -----------------

router.get('/ChangeStatusDelivered',orderController.ChangeStatusDelivered)
router.get('/ChangesStatusShipped',auth.isLogin,orderController.ChangeStatusShipped)
router.get('/ChangeStatusReturned',auth.isLogin,orderController.ChangeStatusReturned)
router.get('/ChangeStatuscancelled',auth.isLogin,orderController.ChangeStatuscancelled)


// admin coupon ----------------------------------------
router.get('/admin-coupons',auth.isLogin,couponController.adminCoupons)
router.get('/addCoupon',auth.isLogin,couponController.adminAddCouponPage)
router.post('/addCoupon',auth.isLogin,couponController.adminAddCoupon)

router.get('/admineditcoupon',auth.isLogin,couponController.adminGetCopons)
router.post('/edit-coupon/:id',auth.isLogin,couponController.adminEditCoupon)
router.get('/admindeletecoupon',auth.isLogin,couponController.adminDeleatCoupon)
router.get('/adminrecovercoupon',auth.isLogin,couponController.adminReverCopon)

// admin offers

 router.get('/admin-offers',adminController.addOffer)
 router.post('/create-offer',adminController.createOffer)

 router.get('/categoryoffer',adminController.addOfferCategory)
 router.post('/categoryoffer',adminController.applyOfferToCategory )

 // for banners

 router.get('/admin-banners',bannerController.adminBanners)

 router.get("/add-banner",bannerController.adminAddBannerPage)
 router.post("/add-banner",upload.single('bannerImage'),bannerController.adminAddBanner)

 router.get ('/admineditbanner',bannerController.adminGetBanner)
 router.post('/edit-banner/:id',upload.single('bannerImage'),bannerController.adminEditBanner)
 router.get('/admindeletebanner',bannerController.adminDeleteBanner)
 router.get('/adminrecoverbanner',bannerController.adminRecoverBanner)

// for sales report and pdf
router.get('/totalSaleExcel',adminReportController.totalSaleExcel)
router.get('/todayRevenueExcel',adminReportController.totalRevenueExcel)
router.get('/allProductExcel',adminReportController.productListExcel)
router.get('/allOrderStatusExcel',adminReportController.allOrderStatus)
router.get('/customDate',adminReportController.customPDF)
 
module.exports = router;






