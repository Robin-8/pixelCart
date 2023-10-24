const { log } = require('handlebars/runtime');
const couponHelper = require('../helpers/couponHelper')
const cartHelper = require('../helpers/cartHelper')

const adminCoupons = async(req,res)=>{
    try {
        const coupons = await couponHelper.adminGetAllCoupons()
        // console.log(coupons,'copon common');

        const itemsPerPage = 5;
        const currentPage = parseInt(req.query.page) || 1;
        const startIndex = (currentPage -1)* itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCoupons = coupons.slice(startIndex,endIndex);
        
        const totalPages = Math.ceil(coupons.length / itemsPerPage);
        console.log(totalPages,'totalpage');
        const pages =[]

        for (let i= 1;i<=totalPages;i++){
            pages.push(i);
        }

        res.render('admin/adminCoupons',{
            coupons : paginatedCoupons,
            currentPage,
            totalPages,
            pages,
            admin : true,
            title : "Coupons"
        })
    } catch (error) {
        console.log(error);
    }
}
const adminAddCouponPage = async(req,res)=>{
    try {
        res.render('admin/adminAddCoup',{
            admin:true,title:"Add Coupon"
        });
    } catch (error) {
        console.log(error);
    }
}

const adminAddCoupon = async(req,res)=>{
    try {
       
        await couponHelper.addCoupon(req.body)
        res.redirect('/admin/admin-coupons') 
    } catch (error) {
        console.log(error);
    }
}
const adminDeleatCoupon = async(req,res)=>{
    try {
        try {
            const couponId = req.query.couponId
            const coupon = await couponHelper.getCouponById({_id:couponId})
            if(!coupon){
                res.redirect('/admin/admin-coupons')
            }
            await couponHelper.softDeleteCoupon({couponId})
            res.redirect('/admin/admin-coupons')
        } catch (error) {
            console.log(error);
            res.redirect('/admin/admin-coupons')
        }

    } catch (error) {
        console.log(error);
    }
}
const adminReverCopon = async(req,res)=>{
    try {
        try {
            const couponId = req.query.couponId
            const coupon = await couponHelper.getCouponById({_id:couponId})
            if(!coupon){
                res.redirect('/admin/admin-coupons')
            }
            await couponHelper.softRecoverCoupon({couponId})
            res.redirect('/admin/admin-coupons')
        } catch (error) {
            console.log(error);
            res.redirect('/admin/admin-coupons')
        }
    } catch (error) {
        console.log(error);
    }
}

const adminGetCopons = async(req,res)=>{
    try {
     
        const couponId = req.query.couponId;
        const coupon = await couponHelper.getCouponById({_id:couponId})
        if(!coupon){
            return res.redirect("/admin/admin-coupons")

        }
        console.log(couponId,'couponid always');
        res.render('admin/adminCouponEdit',{
            coupon:coupon,
            admin:true,
            title:'Admin Edit Coupons'
        })
    } catch (error) {
        console.log(error);
        res.redirect('/admin/admin-coupons')
    }
}

const adminEditCoupon = async(req,res)=>{
    try {
        console.log(req.params,'params here' );
        // console.log(req.body,'reqbody is here==');
        couponHelper.updateCoupon(req.params.id,req.body)
        res.redirect('/admin/admin-coupons')
    } catch (error) {
        console.log(error,'edit coupon failed');
    }
}
const userGetCoupon = async(req,res)=>{
    try {
        const coupons = await couponHelper.userGetAllCoupon()
        // console.log(coupons,"in getcoupons")
        res.json({coupons})
    } catch (error) {
        console.log(error,'error in userGetCoupon');
    }
}

const userApplayCoupon = async(req,res)=>{
    try {
        
        const couponCode = req.body.couponCode
        // console.log(">>>>>>>>>>>>>>>>>",couponCode);
        const userId = req.session.user._id
        console.log(req.session.user._id);
        let cartTotal = await cartHelper.getTotal(userId)
     
        //cartTotal = cartTotal[0].totalPages
       
        let couponDetails = await couponHelper.getCouponCode(couponCode)
        // console.log("><><>><><><><>>>>>><>><><><><>",couponDetails);
        // couponDetails = couponDetails[0]
        
        if(cartTotal >= couponDetails.minAmount){
           
        //    let discount = (cartTotal * couponDetails.discount)*100
            // if(discount > couponDetails.maxDiscount){
            //     discount = couponDetails.maxDiscount
            // }

            let discount = couponDetails.discount
            cartTotal = cartTotal - discount;
        
        
            console.log("XXXXXXXXXXX",discount);
            
            res.json({discount,noMinAmount : false})
        }else{
            res.json({noMinAmount:true})
        }
    } catch (error) {
        console.log(error);
    }
}

const getCoupon = async(req,res)=>{
    try {
        const couponId = req.params.couponId
        const coupon = await couponHelper.getCouponById({_id:couponId})
        res.json({response:coupon})
    } catch (error) {
        console.log(error,'copon not find');

    }
}



module.exports = {
    adminAddCoupon,
    adminCoupons,
    adminAddCouponPage,
    adminDeleatCoupon,
    adminReverCopon,
    adminGetCopons,
    adminEditCoupon,
    userGetCoupon,
    userApplayCoupon,
    getCoupon
}