const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController')
const upload = require('../helpers/multer');
const { route } = require('.');







router.get('/',adminController.getAdminLogin) 

router.post('/admin-login',adminController.verifyAdmin) 

router.get('/add-product',adminController.adminAddProductPage)
router.post('/add-product',upload.array('Images',4),adminController.adminAddProduct)

router.get('/admineditproduct',adminController.adminGetProduct)
router.post('/edit-product/:id',adminController.adminEditProduct)
router.get('/admindeleteproduct',adminController.adminDeleteProduct)
router.get('/recoverdeletproduct',adminController.adminRecoverDeletePrdt)

router.get('/adminblock_user',adminController.adminBlockUser)
router.get('/adminUn_block_user',adminController.adminUnBlockUser)
router.get('/admindeleteuser',adminController.adminDeleteUser)

router.get('/allUsers',adminController.getAllUsers )
router.get('/allCategory',categoryController.getAllCategory)

// router.get('/Cameracategory',adminController.getCameras)
// router.get('/ActionCameracategory',adminController.getActionCamera)
// router.get('/SurveillanceCameracategory',adminController.getSurveillanceCamera)
router.get('/addCategory',categoryController.loadCategory)
router.post('/addCategory',categoryController.createCategory)

// for admin dashbord 

router.get('/adminDashbord',adminController.Dashbord)
//for edit and delete category

router.get('/editCategory/:categoryId', categoryController.getEditCategory);
router.post('/editCategory/:categoryId', categoryController.postEditCategory);
router.post('/deleteCategory/:categoryId', categoryController.deleteCategory);





module.exports = router;






