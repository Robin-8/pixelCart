const Category = require("../models/categoryModel")
const userHelper = require("../helpers/user-helpers")
const  productHelpers = require('../helpers/product-helpers')
const bcrypt = require('bcrypt');
const async = require("hbs/lib/async");
const categoryHelpers = require('../helpers/ca')

// twilio otp
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

    // Fetch all products
    productHelpers.getAllproducts((products) => {
      res.render('user/LandingPage', { products });
    });
  } catch (error) {
    console.log('Error in landingPage:', error.message);
    res.render('LandingPage', { products: [] });
  }
};

// to send verification code
const verify = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber
    console.log(mobileNumber);
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
// to check the received otp
const verifys = async (req, res) => {
  try {
    const mobile = req.body.mobileNumber
    const otpCode = req.body.otp
    console.log(otpCode, "otp", mobile, "mobile")
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
        res.render('login', { email })
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
    console.log("at post login");
    const user = await userHelper.getUsers({ email: email, password: password });
    if (!user) {
      req.session.loginErr = true
      return res.redirect('/login');
    }
    if (user) {
      req.session.user = user[0]
      // console.log(req.session.user,'jjhjhjgjgj');
      return res.redirect('/home');
    }
  } catch (err) {
    console.log(err);
    console.log("error occured !!!!!here @post login");
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
    // Fetch all products
    productHelpers.getAllproducts((products) => {
      console.log(products,"hgkahsfdakh")
      res.render('user/home', { products, });
    });
  } catch (error) {
    console.log('Error in landingPage:', error.message);
    res.render('user/home', { products: [] });
  }
};

const productListing = async (req, res) => {
  try {
    const categoryName = await productHelpers.getAllName();
    const categories = await 
    if (!req.session.user) {
      res.redirect('/login');
      return;
    }
    // Fetch all products
    productHelpers.getAllProductList((products) => {

      res.render('user/productList', { products });
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
    console.log(product,'vgvybvvbyby');
    if (!product) {
      return res.redirect('/login');
    }
    res.render('user/productDetailsPage', { product: product });
  } catch (err) {
    console.log(err);
    res.redirect('/home');
  }
}
const forgetPassword = (req,res)=>{
  res.render('user/resetPassword')
};

const resetPasswordOTP = async (req, res) => {
  try {
    console.log(req.body);
    const mobileNumber = req.body.mobileNumber; // Get the mobile number from the form input

    // Generate and send OTP
    client.verify.v2.services(verifySid)
      .verifications.create({ to: mobileNumber, channel: 'whatsapp' }) // You can use SMS for password reset
      .then((verification) => {
        console.log(verification.status);
        res.render('verify_otp', { mobileNumber }); // Redirect to OTP verification page
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

    // Verify the OTP
    client.verify
      .services(verifySid)
      .verificationChecks.create({ to: mobile, code: otpCode })
      .then((verificationCheck) => {
        if (verificationCheck.status === 'approved') {
          res.render('resetPassword', { mobile }); // Redirect to the password reset form
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

    // Implement your password reset logic here, e.g., update the password in your database
    bcrypt.hash(newPassword,10,(err,hash)=>{
      if(err){
        console.log('error passing new password',err);
      }else{
        User.findOneAndUpdate({ _id: userId }, { password: hash }, (err, user) =>{
          if(err){
            console.log('error updating password in data base',err);
            res.send('password update error')
          }else{
            res.send('password update successfully')
          }
        })
      }
    })

    res.send('Password reset successful'); // You can also redirect to a login page
  } catch (error) {
    console.log(error.message);
    res.send('Error resetting password');
  }
};
const orderSuccess= async(req,res)=>{
  try {
    res.render('user/orderPlaced')      
  } catch (error) {
    console.log(error);
  }

}  
const razorpay = (req,res)=>{
  try {
    res.render('user/razorpay',{razorpay_key:"rzp_test_pGz4qvobcKcY0w"})
  } catch (error) {
    console.log('razorpay not working',error);
  }
}

const fillterProduct =  async(req,res)=>{

  
    const productCategory = req.body.productCategory;
    const productRange = req.body.productRange;
    let sort = req.body.sort
    let serarch = req.body.search;
    let rangeFilter =[]
    const filter = {isDeleated:false}
    if(serarch){
      const regex = new RegExp('^' + serarch, 'i');
      filter.name = regex
    }
    if(productCategory){
      filter.category = {$in:productCategory}
    }
    if(productRange){
      for(let i = 0;i<productRange.length;i++){
        if(productRange[i] == 'lt15000'){
          rangeFilter.push({price:{$lte : 15000}})
        }
        if(productRange){
          rangeFilter.push({price:{$gt:15000,$lte : 40000}})
        }
        if(productRange){
          rangeFilter.push({price:{$gt:40000,$lte:80000}})
        }
        if(productRange){
          rangeFilter.push({price:{$gt:80000,$lte:150000}})
        }
        if(productRange){
          rangeFilter.push({price:{$gt:150000,$lte:200000}})
        }
        if(productRange){
          rangeFilter.push({price:{$gt:200000}})
        }
      }
      filter.$or = rangeFilter
    }
    if(sort){
      if(sort =='HL'){
        sort = {price:-1}
      }
      if(sort == 'LH'){
        sort = {price:1}
      }
      if(sort == 'NA'){
        sort = {date:-1}
      }
    }else{
      sort = {date:-1}
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