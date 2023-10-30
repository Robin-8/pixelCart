const Cart = require('../models/cartModel')
const cartHelper = require('../helpers/cartHelper');
const async = require('hbs/lib/async');



const cartCount = ((userId)=>{
    return new Promise(async(resolve,reject)=>{
        const userCart =await Cart.findOne({user:userId});
        
        const cartCount =0 
        if(userCart){
          
           const cartCount = await cartHelper.getCartCount(userId)

       
        }
        resolve(cartCount)

    })
})

module.exports = {
    cartCount
}