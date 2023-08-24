const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/',adminController.getAdminLogin) 

router.post('/admin-login',adminController.verifyAdmin) 

router.get('/add-product',adminController.adminAddProductPage)
router.post('/add-product',adminController.adminAddProduct)

router.get('/admineditproduct',adminController.adminGetProduct)
router.post('/edit-product/:id',adminController.adminEditProduct)
router.get('/admindeleteproduct',adminController.adminDeleteProduct)
router.get('/recoverdeletproduct',adminController.adminRecoverDeletePrdt)

router.get('/adminblock_user',adminController.adminBlockUser)
router.get('/adminUn_block_user',adminController.adminUnBlockUser)
router.get('/admindeleteuser',adminController.adminDeleteUser)

router.get('/allUsers',adminController.getAllUsers )

router.get('/Cameracategory',adminController.getCameras)
router.get('/ActionCameracategory',adminController.getActionCamera)
router.get('/SurveillanceCameracategory',adminController.getSurveillanceCamera)

router.get('/logout',adminController.logOut)

module.exports = router;






