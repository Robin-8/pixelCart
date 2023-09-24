const wishlist = require('../models/wishlistModel')
const mongoose = require('mongoose')
const connectDB = require('../config/connection')

const addToWishlist = (proId, userId) => {
    console.log('chkk wishlist hpr');
    let proObj = {
      item: proId,

    }
    return new Promise(async (resolve, reject) => {
      console.log(userId, "addtowishlist");
      try {
        let userwishlist = await Wishlist.findOne({ user: userId });
        console.log(userwishlist ,'chk  userwishlist ');
        if (userwishlist) {
          console.log(userwishlist,"userwishlist");
          try {
            console.log("proexisst");
            // const proExist =userwishlist.products.some(product => product.item.toString() === proId.toString());
            const proExist = userwishlist.products.some(product => product.toString() === proId.toString());
            console.log(proExist,"proexisst");

            if (proExist) {
              console.log("if   proexisst");
              await Wishlist.updateOne(
                {user:(userId) },
                {
                  $pull: { 'products': proId}
                } 
              ).then(() => {
                resolve()
                }) 
                .catch((err) => {
                console.error(err);  
                })
            }
            else{

              console.log("chkk not proExist");
              await Wishlist.updateOne(
              { user: userId },
              {
                $push: { products: proId }
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
          console.log("chkk add new userr");
            let WishlistObj = {
                user: userId,
                products: proId
              };

          let newWishlist = new Wishlist(WishlistObj);
          await newWishlist.save();
          resolve();
        }
      } catch (error) {
        console.log("Failed to add to cart:", error);
        reject(error);
      }
    });
  }



const getwishlistProducts = (userId)=>{
    return new Promise (async(resolve,reject)=>{
        try {
            const WishlistItems = await Wishlist.aggregate([
                {
                    $match:{user: mongoose.Types.ObjectId.createFromHexString(userId) }
                },
                {
                    $lookup: {
                      from: 'products',
                      localField: 'products',
                      foreignField: '_id',
                      as: 'productDetails'
                    }
                  },
                  {
                    $project: {
                      _id: 0, // Exclude _id field from the output
                      productDetails: 1 // Include the productDetails field in the output
                    }
                  }
            ]) .exec();
            
        resolve(WishlistItems[0].productDetails); // Return the list of product details
        } catch (error) {
            reject(error);
        }
    })
}
