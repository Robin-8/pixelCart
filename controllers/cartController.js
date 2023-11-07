const Cart = require('../models/cartModel')


const CartManeagement = async(req,res)=>{
    try {
        res.render('cart')
    } catch (error) {
        console.log(error.message);
    }
}

const cartItem = async(req,res)=>{
    const ProductId = req.body.ProductId
    const product = await Cart.findById(ProductId)

    const cartItem = {
        ProductId,
        quantity: 1,
      };
    
      await Cart.create(cartItem);
    
      res.redirect('/placement-order');
}

module.exports = {
    CartManeagement,
    cartItem
}