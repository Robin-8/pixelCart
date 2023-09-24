const couponHelper = require('../helpers/couponHelper')

const adminCoupons = async(req,res)=>{
    try {
        const coupons = await couponHelper.adminGetAllCoupons()

        const itemsPerPage = 5;
        const currentPage = parseInt(req.query.page) || 1;
        const startIndex = (currentPage -1)* itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCoupons = coupons.slice(startIndex,endIndex);
        const totalPages = Math.ceil(coupons.length / itemsPerPage);
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
module.exports = {
    adminAddCoupon,
    adminCoupons,
    adminAddCouponPage
}