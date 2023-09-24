const Cart = require('../models/cartModel')
const cartHelper = require('../helpers/cartHelper');
const async = require('hbs/lib/async');



const cartCount = ((userId)=>{
    return new Promise(async(resolve,reject)=>{
        const userCart =await Cart.findOne({user:userId});
        
        const cartCount =0 
        if(userCart){
            console.log(userCart,'here is user cart');
           const cartCount = await cartHelper.getCartCount(userId)

           console.log(cartCount,'here is cartcount');
        }
        resolve(cartCount)

    })
})

module.exports = {
    cartCount
}