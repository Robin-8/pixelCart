const Cart = require('../models/cartModel')
const User=require('../models/user')
const cartHelpers = require('../helpers/cartHelper')
const connectDB = require("../config/connection");
const { response } = require('express')
const productHelper = require('../helpers/product-helpers');
const { log } = require('handlebars/runtime');

const couponHelper = require('../helpers/couponHelper')



const addToCart = async (req,res)=>{
    console.log(req.params.id)
    await cartHelpers.addToCart (req.params.id,req.session.user._id).then((response)=>{
        res.redirect('/carts') 
   
    })
}



const 
getCart = async(req,res)=>{
    try {
        
       
            const products = await cartHelpers.getCartProducts(req.session.user._id)
             const total =await  cartHelpers.getTotal(req.session.user._id)
             



const userId=req.session.user._id;

const cart= await Cart.findOne({user: userId})



            const data ={
                products:products,
                total:total,
                
                
            }
          
            res.render('user/cart',data)
      
    } catch (error) {
        console.log(error.message);
    }
}

const changeQuantity = async (req, res) => {
    try {
        console.log(req.body);
        const product = await productHelper.getProductById(req.body.product);
        const proStock = product.Stock;

        const response = await cartHelpers.changeProuductQuantity(req.body, proStock);
        
        res.json(response);
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
      
        const userId = req.session.user._id; 
        
       

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in session." });
        }

     
        const cart = await Cart.findOne({user:userId });
        console.log(cart,'this cart====');

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        
        const productIndex = cart.products.findIndex((product) => product.item.equals(productId));

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart." });
        }

      
        cart.products.splice(productIndex, 1);

        
        await cart.save();

        res.redirect('/carts');

    } catch (error) {
        console.log('Error in deleteCart: ', error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = {
    addToCart,
   
    getCart,
    changeQuantity,
    removeCartProduct,
    deleteCart
}







