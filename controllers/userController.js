const Category = require("../models/categoryModel")
const userHelper = require("../helpers/user-helpers")
const  productHelpers = require('../helpers/product-helpers')

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
      res.render('LandingPage', { products });
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
        res.render('signup', { mobile })
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
    res.render('signup&login', { "loginErr": req.session.loginErr })
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
    if (req.session.user) {
      res.redirect('/home');
      return;
    }

    // Fetch all products
    productHelpers.getAllproducts((products) => {
      res.render('home', { products });
    });
  } catch (error) {
    console.log('Error in landingPage:', error.message);
    res.render('home', { products: [] });
  }
};
const getProductDetails = async (req, res) => {
  try {
    const id = req.params.id
    const product = await productHelpers.getProductById({ _id: id });
    if (!product) {
      return res.redirect('/login');
    }
    res.render('productDetailsPage', { product: product });
  } catch (err) {
    console.log(err);
    res.redirect('/home');
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
  getProductDetails
}