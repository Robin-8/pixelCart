const connectDB = require('../config/connection')
const Coupon = require('../models/couponModel')


const adminGetAllCoupons = async(req,res)=>{
    try {
        connectDB()
        return await Coupon.find()
    } catch (error) {
        console.log(error,'cannot find coupon');
    }
}

const userGetAllCoupon = async(req,res)=>{
    try {
        connectDB()
        return await Coupon.find({isDeleted:false})
    } catch (error) {
        console.log(error);
    }
}



const addCoupon = async(couponDetails)=>{
    try {
        connectDB()
        return await Coupon.create(couponDetails)
    } catch (error) {
        console.log(error,'cannot add create addcoupon');
    }
}

module.exports = {
    addCoupon,
    adminGetAllCoupons,
    userGetAllCoupon
}