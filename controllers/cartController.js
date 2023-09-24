const Cart = require('../models/cartModel')
const User=require('../models/user')
const cartHelpers = require('../helpers/cartHelper')
const connectDB = require("../config/connection");
const { response } = require('express')
const productHelper = require('../helpers/product-helpers');
const { log } = require('handlebars/runtime');
// const async = require('hbs/lib/async');


const addToCart = async (req,res)=>{
    console.log(req.params.id)
    await cartHelpers.addToCart (req.params.id,req.session.user._id).then((response)=>{
        res.redirect('/carts') 
        // res.json({response:true}); 
    })
}

// const cartItem = async(req,res)=>{
//     const ProductId = req.body.ProductId
//     const product = await Cart.findById(ProductId)
//     console.log(product);

//     const cartItem = {
//         ProductId,
//         quantity: 1,
//       };
    
//       await Cart.create(cartItem);
    
//       res.redirect('/placement-order');
// }

const 
getCart = async(req,res)=>{
    try {
        
        // if(req.session.user._id){
            const products = await cartHelpers.getCartProducts(req.session.user._id)
             const total =await  cartHelpers.getTotal(req.session.user._id)
        


const userId=req.session.user._id;

const cart= await Cart.findOne({user: userId})



            const data ={
                products:products,
                total:total,
                
            }
            res.render('user/cart',data)
      
        // }
    } catch (error) {
        console.log(error.message);
    }
}

const changeQuantity= async(req,res)=>{
    try {
        console.log(req.body)
         const product = await productHelper.getProductById(req.body.product)
         const proStock = product.Stock
        //  console.log(proStock,'stokHere');

        await cartHelpers.changeProuductQuantity(req.body).then((response)=>{
            console.log(response,'quntitychnge'); 
            res.json(response)
         })
    } catch (error) {
        console.log(error);
    }
}
const removeCartProduct= async(req,res,next)=>{
   try {
     await cartHelpers.removeCartProduct(req.body).then((response)=>{
        res.json(response)
     })
   } catch (error) {
    console.log(error.message);
   }
}

const deleteCart = async (req, res) => {
    try {
        const productId = req.query.id;
        const cartId = req.session.cartId; // Assuming you have a session variable for cartId

        if (!cartId) {
            return res.status(400).json({ message: "Cart ID not found in session." });
        }

        // Use Mongoose to find the user's cart by its ID
        const cart = await Cart.findOne({ _id: cartId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // Find the index of the product in the cart's products array
        const productIndex = cart.products.findIndex((product) => product.item.equals(productId));

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart." });
        }

        // Remove the product from the products array
        cart.products.splice(productIndex, 1);

        // Save the updated cart
        await cart.save();

        res.redirect('/carts') 

    } catch (error) {
        console.log('Error in deleteCart: ', error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = {
    addToCart,
    //cartItem,
    getCart,
    changeQuantity,
    removeCartProduct,
    deleteCart
}







