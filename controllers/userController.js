const Category = require("../models/categoryModel")
const userHelper = require("../helpers/user-helpers")
const productHelpers = require('../helpers/product-helpers')
const bcrypt = require('bcrypt');
const async = require("hbs/lib/async");
const categoryHelper = require('../helpers/categoryHelper')
const categoryController = require('../controllers/categoryController')
const bannerHelper = require("../helpers/bannerHelper")



const accountSid = "AC270df992da52b5449497119dc18e587e";
const authToken = "524920901fca86b6b704297c2c78c0a5";
const verifySid = "VAfd550d640b6494827f4e6879f08c66f1";
const client = require("twilio")(accountSid, authToken);

const landingPage = async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect('/home');
      return;
    }

  
    const products = await productHelpers.getAllproducts();

    res.render('user/LandingPage', { products });
  } catch (error) {
    console.log('Error in landingPage:', error.message);
    res.render('LandingPage', { products: [] });
  }
};



const verify = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber

    client.verify.v2.services(verifySid)
      .verifications.create({ to: mobileNumber, channel: 'whatsapp' })
      .then((verification) => {
        console.log(verification.status);
        res.render('user/verify_otp', { mobileNumber });
      })
      .catch((error) => {
        console.log(error);
        res.send('Error occurred during OTP generation');
      });
  } catch (error) {
    console.log(error.message);
  }
};

const verifys = async (req, res) => {
  try {
    const mobile = req.body.mobileNumber
    const otpCode = req.body.otp

    client.verify
      .services(verifySid)
      .verificationChecks.create({ to: mobile, code: otpCode })
      .then((verificationCheck) => {
        console.log(verificationCheck.status);
        res.render('user/signup', { mobile })
      })
      .catch((error) => {
        console.log(error);
        res.send('Error occurred during OTP verification');
      });
  } catch (error) {
    console.log(error.message);
  }
}

const signup = async (req, res) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const mobile = req.body.mobile
    const password = req.body.password
    const user = { name, email, mobile, password }
    userHelper.addUser(user, stat => {
      if (stat === "DONE") {
        console.log("signup done");
        res.render('./user/login', { email })
      } else if (stat === "USER_ALREADY_EXISTS")
        res.redirect("/login")
    })
  } catch (error) {
    console.log(error.message);
  }
}

const login = async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect('/home')
    }
    res.render('user/signup&login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  } catch (error) {
    console.log(error.message);
  }
}

const getuserlogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password
   
    const user = await userHelper.getUsers({ email: email, password: password });
    if (!user) {
      req.session.loginErr = true
      return res.redirect('/login');
    }
    if (user) {
      req.session.user = user[0]

      return res.redirect('/home');
    }
  } catch (err) {
    console.log(err);

    res.redirect('/login');
  }
}

const logout = async (req, res) => {
  try {
    req.session.user = false
    res.redirect('/')
  } catch (error) {
    console.log(error.message);
  }
}

const home = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/login');
      return;
    }


    const products = await productHelpers.getAllproducts();
    const banner = await bannerHelper.userGetBanner();
   
   
    res.render('user/home', { products ,banner});
  } catch (error) {
    console.log('Error in landingPage:', error.message);
    res.render('user/home', { products: [] });
  }
};




const productListing = async (req, res) => {
  try {
    const name = await categoryController.getAllName();
    const categories = await Category.find();
    const categoryNames = categories.map(category => category.name);

    if (!req.session.user) {
      res.redirect('/login');
      return;
    }

  
    productHelpers.getAllProductList((products) => {
      const itemsPerPage = 8;
      let currentPage = parseInt(req.query.page);
      if (isNaN(currentPage)) {
        currentPage = 1;
      }
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProducts = products.slice(startIndex, endIndex);
      const totalPages = Math.ceil(products.length / itemsPerPage);
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      res.render('user/productList', {
        products: paginatedProducts, 
        name,
        categories,
        paginatedProducts,
        currentPage,
        totalPages,
        pages,
      });
    });
  } catch (error) {
    console.log('Error in landingPage:', error.message);
    res.render('user/home', { products: [] });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const id = req.params.id
    const product = await productHelpers.getProductById({ _id: id });
 
    if (!product) {
      return res.redirect('/login');
    }
    res.render('user/productDetailsPage', { product: product });
  } catch (err) {
    console.log(err);
    res.redirect('/home');
  }
}
const forgetPassword = (req, res) => {
  res.render('user/resetPassword')
};

const resetPasswordOTP = async (req, res) => {
  try {
 
    const mobileNumber = req.body.mobileNumber; 

  
    client.verify.v2.services(verifySid)
      .verifications.create({ to: mobileNumber, channel: 'whatsapp' }) 
      .then((verification) => {
        console.log(verification.status);
        res.render('verify_otp', { mobileNumber }); 
      })
      .catch((error) => {
        console.log(error);
        res.send('Error occurred during OTP generation');
      });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyResetPasswordOTP = async (req, res) => {
  try {
    const mobile = req.body.mobileNumber;
    const otpCode = req.body.otp;


    client.verify
      .services(verifySid)
      .verificationChecks.create({ to: mobile, code: otpCode })
      .then((verificationCheck) => {
        if (verificationCheck.status === 'approved') {
          res.render('resetPassword', { mobile }); 
        } else {
          res.send('OTP verification failed');
        }
      })
      .catch((error) => {
        console.log(error);
        res.send('Error occurred during OTP verification');
      });
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const mobile = req.body.mobileNumber;
    const newPassword = req.body.newPassword;

    
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) {
        console.log('error passing new password', err);
      } else {
        User.findOneAndUpdate({ _id: userId }, { password: hash }, (err, user) => {
          if (err) {
            console.log('error updating password in data base', err);
            res.send('password update error')
          } else {
            res.send('password update successfully')
          }
        })
      }
    })

    res.send('Password reset successful'); 
  } catch (error) {
    console.log(error.message);
    res.send('Error resetting password');
  }
};
const orderSuccess = async (req, res) => {
  try {
    res.render('user/orderPlaced')
  } catch (error) {
    console.log(error);
  }

}
const razorpay = (req, res) => {
  try {
    res.render('user/razorpay', { razorpay_key: "rzp_test_pGz4qvobcKcY0w" })
  } catch (error) {
    console.log('razorpay not working', error);
  }
}

const fillterProduct = async (req, res) => {

  const productCategory = req.body.productCategory;
  const productRange = req.body.productRange;
  let sort = req.body.sort
  let serarch = req.body.search;
  
  
  let rangeFilter = []
  const filter = { Deleted: false }

  if (serarch) {
    
    const regex = new RegExp('^' + serarch, 'i');
    filter.Name = regex
  }
  if (productCategory) {
    filter.Category = { $in: productCategory }
  }
  
  if (productRange) {
    for (let i = 0; i < productRange.length; i++) {
      const el = productRange[i]
      if (el === 'lt15000') {
        rangeFilter.push({ Price: { $lte: 15000 } })
      }
      if (el === 'lt40000') {
        rangeFilter.push({ Price: { $gt: 15000, $lte: 40000 } })
      }
      if (el === 'lt80000') {
        rangeFilter.push({ Price: { $gt: 40000, $lte: 80000 } })
      }
      if (el === 'lt150000') {
        rangeFilter.push({ Price: { $gt: 80000, $lte: 150000 } })
      }
      if (el === 'lt200000') {
        rangeFilter.push({ Price: { $gt: 150000, $lte: 200000 } })
      }
      if (el === 'gt200000'){
        rangeFilter.push({Pruce:{$gt:200000}})
      }
    }
  }

  if (rangeFilter.length)
    filter.$or = rangeFilter

 
  if (sort) {
    if (sort == 'HL') {
      sort = { Price: -1 }
    }
    if (sort == 'LH') {
      sort = { Price: 1 }
    }
    if (sort == 'NA') {
      sort = { date: -1 }
    }
  } else {
    sort = { date: -1 }
  }
  const products = await productHelpers.getFilterName(filter, sort);
 
  
  const itemsPerPage = 8;
  let currentPage = parseInt(req.body.page);
  if (isNaN(currentPage)) {
    currentPage = 1;
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  if (products.length) {
    res.json({ products: paginatedProducts, currentPage, totalPages, pages })
  } else {
    res.json({ noProducts: true })
  }
}


module.exports = {
  landingPage,
  verify,
  verifys,
  signup,
  login,
  getuserlogin,
  logout,
  home,
  getProductDetails,
  forgetPassword,
  resetPasswordOTP,
  resetPassword,
  verifyResetPasswordOTP,
  orderSuccess,
  razorpay,
  productListing,
  fillterProduct

}