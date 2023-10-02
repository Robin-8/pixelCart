const { TrustProductsEntityAssignmentsListInstance } = require('twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEntityAssignments');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers")
const product = require('../models/product')
const mongoose = require('mongoose');
const Product = require('../models/product')




const getAdminLogin = async (req, res) => {
  try {
    if (req.session.admin) {
      productHelpers.getAllproducts((products) => {
        if (products) {
          res.render('./admin/adminPanel', { products });
        } else {
          console.log('Failed to retrieve products');
        }
      });
    } else {
      res.render('admin/admin-login');
    }
  }
  catch (error) {
    console.log(error.message);
  }
}

const verifyAdmin = async (req, res) => {
  try {
    try {
      const email = req.body.email;
      const password = req.body.password
      const admin = await userHelpers.getAdminByMail({ email, password });
      if (admin.is_admin) {
        req.session.admin = true
        return res.redirect('/admin');
      } else {
        res.render('admin/admin-login');
      }
    }
    catch (err) {
      console.log(err);
      res.redirect('/');
    }
  }
  catch (error) {
    console.log(error.message);
  }
}

const logOut = async (req, res) => {
  try {
    req.session.admin = false
    res.redirect('/admin')
  }
  catch (error) {
    console.log(error.message);
  }
}

const adminGetProduct = async (req, res) => {
  try {
    try {
      const productId = req.query.productId;
      const product = await productHelpers.getProductById({ _id: productId });
      if (!product) {
        return res.redirect('/admin');
      }
      res.render('admin/admineditproduct', { product: product });
    }
    catch (err) {
      console.log(err);
      res.redirect('/admin'); l
    }
  }
  catch (error) {
    console.log(error.message);
  }
}

const adminBlockUser = async (req, res) => {
  try {
    userHelpers.updateUserBlockedStatus(req.query.userId).then(() => {
      res.redirect('/admin/allUsers');
    })
  }
  catch (error) {
    console.log(error.message);
  }
}

const adminUnBlockUser = async (req, res) => {
  try {
    userHelpers.updateUserUnBlockedStatus(req.query.userId).then(() => {
      res.redirect('/admin/allUsers');
    })
  }
  catch (error) {
    console.log(error.message);
  }
}

const adminDeleteUser = async (req, res) => {
  try {
    try {
      const userId = req.query.userId;
      const user = await userHelpers.getUserById(userId);
      if (!user) {
        return res.redirect('/admin');
      }
      await userHelpers.deleteUserById(userId);
      res.redirect('/admin/allUsers');
    } catch (err) {
      console.log(err);
      res.redirect('/admin');
    }
  }
  catch (error) {
    console.log(error.message);
  }
}

const adminDeleteProduct = async (req, res) => {
  try {
    try {
      const productId = req.query.productId;
      const product = await productHelpers.getProductById({ _id: productId });
      if (!product) {
        return res.redirect('/admin');
      }
      await productHelpers.softDeleteProduct(productId);
      res.redirect('/admin');
    }
    catch (err) {
      console.log(err);
      res.redirect('/admin');
    }
  }
  catch (error) {
    console.log(error.message);
  }
}
const adminRecoverDeletePrdt = async (req, res) => {
  try {
    try {
      const productId = req.query.productId;
      const product = await productHelpers.getProductById({ _id: productId });
      if (!product) {
        return res.redirect('/admin');
      }
      await productHelpers.recoverProduct(productId);
      res.redirect('/admin');
    }
    catch (err) {
      console.log(err);
      res.redirect('/admin');
    }
  }
  catch (error) {
    console.log(error.message);
  }
}

const adminEditProduct = async (req, res) => {
  try {
    // Update the product
    await productHelpers.updateProduct(req.params.id, req.body);
    // console.log(req.body,'======================>');

    // Handle image upload if it exists
    if (req.files && req.files.Image) {
      const image = req.files.Image;
      image.mv('./public/product-images/' + req.params.id + '.jpg', (err) => {
        if (err) {
          console.error('Image upload error:', err);
          // You can handle the error here, e.g., send an error response to the client
        } else {
          // Image uploaded successfully
          console.log('Image uploaded successfully');
        }
      });
    }

    // Redirect to the admin page
    res.redirect('/admin');
  } catch (error) {
    console.error('Error in adminEditProduct:', error.message);
    // Handle the error here, e.g., send an error response to the client
  }
};


const adminAddProductPage = async (req, res) => {
  try {
    
    res.render('admin/add-product')
  }
  catch (error) {
    console.log(error.message);
  }
}


const adminAddProduct = async (req, res) => {
  try {
    // console.log(req.body,'mmmmmmm');
   
    productHelpers.addProduct(req.body,req.files).then((productData)=>{
      
    })
      
       res.render("admin/add-product")
      
   
  }
  catch (error) {
    console.log(error.message);
  }
}

const getAllUsers = async (req, res) => {
  try {
    userHelpers.getAllUsers()
      .then((users) => {
        if (users) {
          res.render('./admin/adminPanel-users', { users });
          console.log(users);
        } else {
          console.log('Failed to retrieve users');
        }
      })
      .catch((error) => {
        console.log('Error retrieving users:', error);
      });
  }
  catch (error) {
    console.log(error.message);
  }

}
const Dashbord = async(req,res)=>{
  try {
    res.render('admin/adminPanel')
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getAdminLogin,
  verifyAdmin,
  logOut,
  adminGetProduct,
  adminBlockUser,
  adminUnBlockUser,
  adminDeleteUser,
  adminDeleteProduct,
  adminEditProduct,
  adminAddProductPage,
  adminAddProduct,
  getAllUsers,
  Dashbord,
 
  adminRecoverDeletePrdt
}