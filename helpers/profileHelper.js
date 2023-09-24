const User = require('../models/user');
const Cart = require('../models/cartModel');
const mongoose = require('mongoose');
const connectDB = require("../config/connection");
const async = require('hbs/lib/async');
const bcrypt = require('bcrypt')


const getProfile = async(userId)=>{
    return new  Promise ((resolve,reject)=>{
         connectDB()
         .then(()=>{
            User.findById(userId).then((data)=>{
                resolve(data)
            }).catch((error)=>{
                console.log(error);
                reject(error)
            })

            
         })
    })
}


const addAddress = async (userId,details)=>{
    console.log(userId,'userid here',details,'here deatails');
    const newAddress={
        _id: new mongoose.Types.ObjectId(),
         fname:details.fname,
         lname:details.lname,
         address1:details.address1,
         address2:details.address2,
         towncity:details.towncity,
         pincode:details.pincode,
         email:details.email,
         mobile:details.mobile

    };
  
   console.log(newAddress,'address here');
    try {
        const user = await User.findById(userId)
        if(!user){
            console.log("user not found");
        }

        if(user){
            return new Promise(async(resolve,reject)=>{
                connectDB()
                .then(()=>{
                    User.updateOne({_id:userId},{$push:{Address:newAddress}})
                    .then((data)=>{
                        resolve(true)
                    }).catch((error)=>{
                        reject(error)
                    })
                })
                
            })
        }
    } catch (error) {
        console.log(error);
       
       
       
    }
}

const fetchAddress = async (userId, addressId,) => {
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                User.findById(userId)
                    .then((user) => {
                        console.log(user, 'user here');
                        const addressIndex = user.Address.findIndex(addr => String(addr._id) === addressId);
                        if (addressIndex !== -1) {
                            const address = user.Address[addressIndex];
                            resolve(address);
                        } else {
                            reject(new Error("Address not found")); // Provide an error object or a descriptive error message
                        }
                    })
                    .catch((error) => {
                        reject(error); // Handle any errors that occurred during the User.findById operation
                    });
            })
            .catch((error) => {
                reject(error); // Handle any errors that occurred during the connectDB operation
            });
    });
};

const updateAddress=async (userId,addressId,updatedAddress)=>{
    try {
        return new Promise (async (resolve,reject)=>{
        const user = await User.findById(userId);
        const addressIndex = user.Address.findIndex(addr => String(addr._id) === addressId);
    
        if (addressIndex !== -1) {
          Object.assign(user.Address[addressIndex], updatedAddress);
          await user.save().then (()=>{
            resolve(true)
          })
        } else {
          console.log("Address not found!");
          reject()
        }
        })
        
      } catch (error) {
        console.error("Error updating address:", error);
      }
}

const deleteAddress = async(userId,addressId)=>{
    try {
        return new Promise(async(resolve,reject)=>{
            const user = await User.findByIdAndUpdate(userId, { $pull: { Address: { _id: addressId} } })
            .then(()=>{
                resolve(true)
            }).catch((error)=>{
                console.log(error);
                reject(error)
            })
        })
    } catch (error) {
        console.log(error,'delete address error');
    }
  
}
const changePrimaryAddress = async(userId,addressId)=>{
    try {
        const user = await User.findById(userId)
        if(!user){
          console.log("user not found");
          return
        }
      // Update all addresses and set 'primary' to false
      user.Address.forEach(address => {
        if (address._id.toString() !== addressId) {
          address.primary = false;
        } else {
          address.primary = true;
        }
      });
      const updateUser = await user.save()
      console.log(updateUser,'updateUser here');
    } catch (error) {
        console.log(error,'updating user');
    }
}
const fetchPrimaryAddress = async (userId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          User.findById(userId)
            .then((data) => {
              const primaryAddress = data.Address.find((address) => address.primary);
              if (primaryAddress) {
                resolve(primaryAddress);
              } else {
                reject(new Error('No primary address found'));
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
    });
  };
  

// const updatePassword = async (userPassword,email)=>{

//     const hashPassword = await bcrypt.hash(userPassword,10)

//     return new Promise((resolve,reject)=>{
//         User.findOne({Email:email}).then(async(user)=>{
//             if(user){
//                 user.password = hashPassword
//                 await user.save()
//                 console.log("password updated successfully");
//                 resolve(true)
//             }else{
//                 console.log('user not found');
//                 reject(false)
//             }
//         }).catch((error)=>{
//             console.log("error passing password",error);
//         })
//     })
// }



module.exports = {
 addAddress,
 getProfile,
 fetchAddress,
 updateAddress,
 deleteAddress,
 changePrimaryAddress,
 fetchPrimaryAddress,
//  updatePassword
}

