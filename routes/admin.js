const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController')
const upload = require('../helpers/multer');
const { route } = require('.');
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController')






router.get('/',adminController.getAdminLogin) 

router.post('/admin-login',adminController.verifyAdmin) 

router.get('/add-product',adminController.adminAddProductPage)
router.post('/add-product',upload.array('Images',4),adminController.adminAddProduct)






router.get('/admineditproduct',adminController.adminGetProduct)
router.post('/edit-product/:id',upload.array('Images',4),adminController.adminEditProduct)
router.get('/admindeleteproduct',adminController.adminDeleteProduct)
router.get('/recoverdeletproduct',adminController.adminRecoverDeletePrdt)

router.get('/adminblock_user',adminController.adminBlockUser)
router.get('/adminUn_block_user',adminController.adminUnBlockUser)
router.get('/admindeleteuser',adminController.adminDeleteUser)

router.get('/allUsers',adminController.getAllUsers )
router.get('/allCategory',categoryController.getAllCategory)
router.get('/adminViewOrderDetails',orderController.getOrderDetails)


router.get('/addCategory',categoryController.loadCategory)
router.post('/addCategory',categoryController.createCategory)

// for admin dashbord 

router.get('/adminDashbord',adminController.Dashbord)
//for edit and delete category

router.get('/editCategory/:categoryId', categoryController.getEditCategory);
router.post('/editCategory/:categoryId', categoryController.postEditCategory);
router.post('/deleteCategory/:categoryId', categoryController.deleteCategory);


router.get('/admin-orderList',orderController.adminOrderDtails)
router.post('/admin/update-order-status/:orderId',orderController.statusUpdateOrder)
router.get('/productDetails/:orderId',orderController.adminOrderDetails)
// router.get('/productDetails/:orderId',(req,res)=>res.send("Here"))



//-------------------status changing -----------------

router.get('/ChangeStatusDelivered',orderController.ChangeStatusDelivered)
router.get('/ChangeStatusShipped ',orderController.ChangeStatusShipped)
router.get('/ChangeStatusReturned',orderController.ChangeStatusReturned)
router.get('/ChangeStatuscancelled',orderController.ChangeStatuscancelled)


// admin coupon ----------------------------------------
router.get('admin-coupons',couponController.adminCoupons)
router.get('/addCoupon',couponController.adminAddCouponPage)
router.post('/addCoupon',couponController.adminAddCoupon)
 
module.exports = router;






