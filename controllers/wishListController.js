const mongoose = require('mongoose')
const wishlistHelper = require('../helpers/wishListHelper')
const { LogContextImpl } = require('twilio/lib/rest/serverless/v1/service/environment/log')

const addToWishlist = (req,res)=>{
    const productId = req.params.id
    console.log(productId,'product ID is here');
    wishlistHelper.addToWishlist(req.session.user._id,req.params.id).then((data)=>{
        console.log(data,'wihlist data');
        res.json({response:true})
    })
}

module.exports = {
    addToWishlist
}