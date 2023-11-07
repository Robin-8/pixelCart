const mongoose = require('mongoose')
const cartModel = require('../models/cartModel')
const connectDB = require('../config/connection')
const Cart = require('../models/cartModel')
const product = require('../models/product')


const addToCart= (proId, userId) => {
    let proObj = {
      item: proId,
      quantity: 1
    }
    return new Promise(async (resolve, reject) => {
      console.log(userId, "addtocart");
      try {
        let userCart = await Cart.findOne({ user: userId });
        if (userCart) {
          console.log(userCart,"usercart");
          try {
            const proExist =userCart.products.some(product => product.item.toString() === proId.toString());
            console.log(proExist,"proexisst");

            if (proExist) {
              
              await Cart.updateOne(
                {user:(userId), 'products.item': proId },
                {
                  $inc: { 'products.$.quantity': 1 }
                } 
              ).then(() => {
                resolve()
                }) 
                .catch((err) => {
                console.error(err);  
                })
            }
            else{
              await Cart.updateOne(
              { user: userId },
              {
                $push: { products: proObj }
              }
              )
              .then(() => {
              resolve()
              })
              .catch((err) => {
              console.error(err);
              }) 
            }
          } catch (error) {
            console.log("Failed to update cart:", error);
            reject(error);
          }
        }
        else {
          let cartObj = {
            user: userId,
            products: [proObj]
          };
          let newCart = new Cart(cartObj);
          await newCart.save();
          resolve();
        }
      } catch (error) {
        console.log("Failed to add to cart:", error);
        reject(error);
      }
    });
  }