const async = require('hbs/lib/async')
const productHelpers = require('../helpers/product-helpers')
const profileHelper = require('../helpers/profileHelper')
const countHelper = require('../helpers/countHelper')
const cartHelper = require("../helpers/cartHelper")


const addAddress = (req,res)=>{
    res.render('user/addNewAddress')
}

const addNewAddress = async(req,res)=>{
    const userId = req.session.user._id
    const data = req.body
 

    const status = await profileHelper.addAddress(userId,data)
    if(status){
        res.render('user/addNewAddress')
    }else{
        res.redirect('/home')
    }
}

const userDetails = async(req,res)=>{
    try {
        const name = req.session.user.name;
       console.log(req.session)
        res.render('user/userProfile',{name})
    } catch (error) {
        console.log(error.message);
    }
}
const manageAddress = async(req,res)=>{

    try {
        const profile = await profileHelper.getProfile(req.session.user._id)
        const address = profile.Address
    
    
        if(!profile.Address.length==0){
            res.render('user/manageAddress',{profile,address,condition:true})
        }else{
            res.render('user/manageAddress',{address,condition:false})
        }
    } catch (error) {
        console.log(error.message);
    }
   
}
const editAddress = async(req,res)=>{
    const addressId = req.query.id
    const userId = req.session.user._id
 

    const address = await profileHelper.fetchAddress(userId,addressId)
    console.log(address,' i am the address');
    res.render('user/editAddress',{address})

}
const updateAddress = async (req, res) => {
    const addressId = req.body.id;
    const userId = req.session.user._id;
   

    const updatedAddress = {
       
        fname: req.body.fname,
        lname: req.body.lname,
        address1: req.body.address1,
        address2: req.body.address2,
        towncity: req.body.towncity,
        pincode: req.body.pincode,
        email: req.body.email,
        mobile: req.body.mobile
    };
 

    const updated = await profileHelper.updateAddress(userId, addressId, updatedAddress);

    if (updated) {
        res.redirect('/manageAddress');
    }
};

const deleteAddress = async(req,res)=>{
    const userId = req.session.user._id
    const addressId = req.query.id
    const fname = req.query.fname
    const lname = req.query.lname
    const status = await profileHelper.deleteAddress(userId,addressId,fname,lname)
    console.log((status));

    if(status){
        res.redirect('/manageAddress')
    }else{
        res.redirect('/home')
    }
}


const getUserProfilePage = async(req,res)=>{
       try {
         const user= req.session.user._id
         console.log(req.session)
       const userName = req.session.user.name
         console.log(user,'user here');
         const cartCount = await countHelper.cartCount(req.session.user._id)
         
         res.render('user/userProfile',{user,cartCount})
       } catch (error) {
          console.log(error);
       }
}


const changePrimaryAddress = async(req,res)=>{
    console.log("check primary address",req.body);
    await profileHelper.changePrimaryAddress(req.session.user._id,req.body.addressId)
}

const addresscheckout = async(req,res)=>{
    const userId = req.session.user._id
    const data = req.body
  

    const status = await profileHelper.addAddress(userId,data)
    if(status){
        res.redirect('checkOut')
    }else{
        res.redirect('/home')
    }
}

module.exports ={
    addAddress,
    addNewAddress,
    userDetails,
    manageAddress,
    editAddress,
    updateAddress,
    deleteAddress,
    addresscheckout,
    changePrimaryAddress,
    getUserProfilePage
}