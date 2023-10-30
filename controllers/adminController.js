const { TrustProductsEntityAssignmentsListInstance } = require('twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEntityAssignments');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers")
const dashbordHelper = require('../helpers/dashbordHelper')
const categoryController = require('../controllers/categoryController')
const categoryHelper = require("../helpers/categoryHelper")

const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require("../models/categoryModel")
const async = require('hbs/lib/async');

const dashbord = async (req,res)=>{
  try {
    if(req.session.admin){
      const orderData = await dashbordHelper.getOrdertotal()
    const orders = orderData[0]

    const salesData = await dashbordHelper.salesData()

    const salesCount = await dashbordHelper.salesCount()
    const onlineCount = await dashbordHelper.onlineCount()
    const onlinePay = onlineCount[0]
    const codCount = await dashbordHelper.codCount()
    const codPay = codCount[0]
    const categorySale = await dashbordHelper.totolCatgorySale()
    


    const arr = [onlinePay.count, codPay.count];
    const paymentBar = JSON.stringify(arr)
    console.log(paymentBar);
    const codCountJSON = JSON.stringify(codCount)
    const onlineCountJSON = JSON.stringify(codCount)
   
    
    const monthlySalesArray = new Array(12).fill(0);

    salesCount.forEach((data) => {
      const date = new Date(data._id);
      const month = date.getMonth();
      monthlySalesArray[month] += data.orderCount;
    });

    const monthlySalesArrayJSON = JSON.stringify(monthlySalesArray);
    const productsCount = await dashbordHelper.productsCount()
    console.log(monthlySalesArrayJSON);
    res.render('admin/adminDashbord', { paymentBar, orders, salesData, salesCount, productsCount, monthlySalesArrayJSON, codCountJSON, onlineCountJSON })
    }else{
      res.render('./admin/admin-login')
    }

  } catch (error) {
    console.log(error);
  }
}



const getProductListing = async (req, res) => {
  try {
    if (req.session.admin) {
      const products = await productHelpers.getAllproducts();
      const itemsPerPage = 5;
      const currentpage = parseInt(req.query.page) || 1;
      const startIndex = (currentpage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const totalpages = Math.ceil(products.length / itemsPerPage);
      const pages = Array.from({ length: totalpages }, (_, i) => i + 1); // Create an array of page numbers
      const currentproduct = products.slice(startIndex, endIndex);
      if (products) {
        res.render('./admin/adminPanel', { products: currentproduct, pages, currentpage, totalpages });
      } else {
        console.log('Failed to retrieve products');
      }
    } else {
      res.render('admin/admin-login');
    }
  } catch (error) {
    console.log(error.message);
  }
};

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
    res.render('/admin');
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
    if (req.files.length === 0) {
      await productHelpers.updateProduct(req.params.id, req.body);
    } else {
      let existingProduct = await Product.findById(req.params.id);

      // Add new images to the existing product's Images array
      existingProduct.Images.push(req.files[0].filename);

      // Update other properties individually
      existingProduct.name = req.body.name;
      existingProduct.description = req.body.Description;
      existingProduct.category = req.body.Category;
      existingProduct.Price = req.body.Price;
      existingProduct.Stock = req.body.Stock;

      // Update the product with the modified data
      existingProduct
        .save()
        .then((updatedProduct) => {
          console.log("Updated details =>", updatedProduct);
        })
        .catch((error) => {
          console.log('Failed to update product:', error);
        });
    }

    res.redirect('/admin');
  } catch (error) {
    console.error('Error in adminEditProduct:', error.message);
  }
};



const adminAddProductPage = async (req, res) => {
  try {
    const categories = await categoryHelper.getAllCategories()
    console.log(categories,'cat===');

    res.render('admin/add-product',{categories})
  }
  catch (error) {
    console.log(error.message);
  }
}


const adminAddProduct = async (req, res) => {
  try {
   

    const caseInsensitiveCatogaryExist = await Product.findOne({
      Name: { $regex: new RegExp('^' + req.body.Name + '$', 'i') }
    });

    if (caseInsensitiveCatogaryExist) {
      console.log('thsi is casesesnityve', caseInsensitiveCatogaryExist);
      res.render("admin/add-product")
    } else {

      productHelpers.addProduct(req.body, req.files).then((productData) => {
        res.redirect('/admin/')
      })
    }



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


const addOffer = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Product.findById(id);

    res.render('admin/add-offer', { product })
  } catch (error) {
    console.log(error, 'add offer page not find');
  }
}

const createOffer = async (req, res) => {
    try {
        const { discountPercentage, product } = req.body;

        const productData = await Product.findById(product);

        // Calculate the discount amount based on the discount percentage
        const discount = (discountPercentage / 100) * productData.Price;

        // Calculate the new offer price after the discount
        const offerPrice = productData.Price - discount;

        // Store the offer price in the product document
        productData.OfferPrice = offerPrice;
        await productData.save();

        res.redirect('/admin');
    } catch (error) {
        console.log(error, 'Offer not created');
    }
};


const addOfferCategory = async(req,res)=>{
  try {
    const id = req.query.id;
    console.log(id,'id is here====');
    const category = await Category.findById(id)
    console.log(category,'category is here===');
    res.render('admin/adiminCatOffer', { category })
  } catch (error) {
    console.log(error,'cannot create cat offer');
  }
}

const applyOfferToCategory = async (req, res) => {
  try {
    const id = req.body.product;
    const category = await Category.findById(id);

    console.log(category, 'id is here====/////');

    const productsInCategory = await Product.find({ Category: category.name });
    console.log(productsInCategory, 'products here////////');

    const discountPercentage = req.body.discountPercentage;
    console.log('this is product discount ', discountPercentage);

    for (const product of productsInCategory) {
      const discountedPrice = product.Price - (discountPercentage / 100) * product.Price;
      product.OfferPrice = discountedPrice;

      // Use a try-catch block to handle errors for individual products
      try {
        const newPrice = discountedPrice.toFixed(2);
        product.Price = newPrice;
        await product.save();
        console.log('-------------------this id ', product, '-------------');
      } catch (error) {
        console.error('Error updating product:', error);
        // You can choose to continue with the loop or break it on error
        // Continue with the loop for other products
        continue;
      }
    }

    console.log('???????????????????????????????????????????????????????????????????????');
    res.redirect('/admin/allCategory');
    console.log('this is updated ');
  } catch (error) {
    console.log('///////////////////////////////////');
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  dashbord,
  getProductListing,
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
  adminRecoverDeletePrdt,
  addOffer,
  createOffer,
  addOfferCategory ,
  applyOfferToCategory
}