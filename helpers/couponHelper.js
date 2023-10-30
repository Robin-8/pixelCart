const async = require('hbs/lib/async')
const connectDB = require('../config/connection')
const Coupon = require('../models/couponModel')
const { log, logger } = require('handlebars')


const adminGetAllCoupons = async (req, res) => {
    try {
       
        connectDB()
        return await Coupon.find()
    } catch (error) {
        console.log(error, 'cannot find coupon');
    }
}

const userGetAllCoupon = async (req, res) => {
    try {
        connectDB()
        return await Coupon.find({ isDeleted: false })
    } catch (error) {
        console.log(error);
    }
}



const addCoupon = async (couponDetails) => {
    try {
        
        return await Coupon.create(couponDetails)
    } catch (error) {
        console.log(error, 'cannot create addcoupon');
    }
}

const getCouponById = async (_id) => {
    try {
        connectDB()
        const coupon = Coupon.findById(_id)
        if (coupon) {
            return coupon
        } else {
            return null
        }
    } catch (error) {
        console.log(error, 'coupon id cannot find');
    }
}

const softDeleteCoupon = async (couponId) => {
    try {
       
        console.log(couponId.couponId, 'couponid here');
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            couponId.couponId,
            { isDeleted: true },
            { new: true }
        );

        if (updatedCoupon) {
            return updatedCoupon
        } else {
            return null
        }
    } catch (error) {
        console.log(error, 'softdelete not possible');
    }
}
const softRecoverCoupon = async (couponId) => {
    try {
        //  await connectDB
        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId.couponId, { isDeleted: false }, { new: true })
        if (updatedCoupon) {
            return updatedCoupon
        } else {
            return null
        }
    } catch (error) {
        console.log(error, 'failed to recover coupon');
    }
}

const updateCoupon = async (couponId, couponDetails) => {
    try {
          
        const updatedCoupon = await Coupon.findOneAndUpdate(
            { _id: couponId },
            couponDetails,
            { new: true }
        );


        if (updatedCoupon) {
            return updatedCoupon
        } else {
            return null
        }
    } catch (error) {
        console.log(error, 'cannot update coupon');
    }
}

const getCouponCode = async (couponCode) => {
    try {
        
        await connectDB()
        const coupons = await Coupon.findOne({ couponCode: couponCode })
  
        return coupons
    } catch (error) {
        console.log(error, 'error finding copon code');
    }
}

module.exports = {
    addCoupon,
    adminGetAllCoupons,
    userGetAllCoupon,
    getCouponById,
    softDeleteCoupon,
    softRecoverCoupon,
    updateCoupon,
    getCouponCode
}