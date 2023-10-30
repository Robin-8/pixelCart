const mongoose = require('mongoose')
const cartModel = require('../models/cartModel')
const connectDB = require('../config/connection')
const Cart = require('../models/cartModel')
const product = require('../models/product')
const { response } = require('express')
const async = require('hbs/lib/async')


const addToCart= (proId, userId) => {
    let proObj = {
      item: proId,
      quantity: 1
    }
    return new Promise(async (resolve, reject) => {
    
      try {
        let userCart = await Cart.findOne({ user: userId });
        if (userCart) {
         
          try {
            const proExist =userCart.products.some(product => product.item.toString() === proId.toString());
          

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
  const getCartProducts= (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cartItems = await Cart.aggregate([
          {
            $match: { user: mongoose.Types.ObjectId.createFromHexString(userId) }
          },
          {
            $unwind:'$products'
          },
          {
            $project:{
              item:'$products.item',
              quantity:'$products.quantity'
            }
          },
          {
            $lookup:{
              from:'products',
              localField:'item',
              foreignField:'_id',
              as:'product'
            }
          },
          {
            $project:{
              item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
            }
          },
        ]).exec();
       
        resolve(cartItems);
      } catch (error) {
        reject(error);
      }
    });
  }
  const getTotal=(userId)=>{
    return new Promise(async (resolve, reject) => {
      
      try {
        const total = await Cart.aggregate([
          {
            $match: { user: mongoose.Types.ObjectId.createFromHexString(userId) }
          },   
          {
            $unwind:'$products'
          },
          {
            $project:{
              item:'$products.item',
              quantity:'$products.quantity'
            }
          },
          {
            $lookup:{
              from:'products',
              localField:'item',
              foreignField:'_id',
              as:'product'
            }
          },
          {
            $project:{
              item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
            }
          },
          {
            $group:{
              _id:null,
              total:{$sum:{$multiply:['$quantity','$product.Price']}}
            }
          }
        ]).exec();
       
        resolve(total[0].total);
      } catch (error) {
        reject(error);
      }
    });
  } 

  const changeProuductQuantity = (details, proStock) => {
   
    const quantity = parseInt(details.quantity);
    const count = parseInt(details.count);

    return new Promise(async (resolve, reject) => {
        if (count === -1 && quantity === 1) {
            await Cart.updateOne(
                { _id: details.cart },
                {
                    $pull: { products: { item: details.product } }
                }
            ).then((response) => {
                resolve({ removeProduct: true });
            });
        } else if (count === 1 && quantity >= proStock) {
            resolve({ outOfStock: true });
        } else if (count === -1 && quantity > proStock + 1) {
            resolve({ outOfStock: true });
        } else {
            await Cart.updateOne(
                { _id: details.cart, 'products.item': details.product },
                {
                    $inc: { 'products.$.quantity': count }
                }
            ).then((response) => {
                resolve(response);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        }
    });
}

  const removeCartProduct=(details)=>{
    return new Promise (async (resolve,reject)=>{
    await Cart.updateOne(
      {_id:(details.cart)},
      {
        $pull:{products:{item:(details.product)}}
      }	
      ).then((response)=>{
        resolve({removeProduct:true})
      })
      .catch((err) => {
        console.error(err);
        reject(err);
        })
    });
  }

  const getSubTotal =(userId)=>{
   
      return new Promise(async (resolve, reject) => {
        try {
          
          const subTotal = await Cart.aggregate([
            {
              $match: { user: mongoose.Types.ObjectId.createFromHexString(userId) }
            },
            {
              $unwind:'$products'
            },
            {
              $project:{
                item:'$products.item',
                quantity:'$products.quantity'
              }
            },
            {
              $lookup:{
                from:'products',
                localField:'item',
                foreignField:'_id',
                as:'product'
              }
            },
            {
              $project:{
                item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
              }
            },
            {
              $project:{
                _id:1,
                SubTotal:{$sum:{$multiply:['$quantity','$product.Price']}}
              }
            },
          
          ]).exec();
 
          resolve(subTotal);
        } catch (error) {
          reject(error);
        }
      });
    }
    const getCartProductList = async (userId) => {
      return new Promise(async (resolve, reject) => {
          connectDB()
              .then(async () => {
                  let cart = await Cart.findOne({ user: userId }).then((data) => {    
                     
                      resolve(data.products)
                  })




              })


      })
  }

  const getCartCount =(userId)=>{
 
    return new Promise (async(resolve,reject)=>{
       try {
        let count=0  
        const  user =await Cart.find({ user: userId })
    
        if(user){
          
          
          let count=0
          for(let i=0;i<user[0].products.length;i++){
            count+=user[0].products[i].quantity
          }
          resolve(count)
        }
       } catch (error) {
             
       }
    })
  }

  module.exports={
     addToCart,
     getCartProducts,
     changeProuductQuantity,
     removeCartProduct,
     getSubTotal,
     getCartCount,
     getCartProductList,
     getTotal,


  }