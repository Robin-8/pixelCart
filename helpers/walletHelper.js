const mongoose = require('mongoose')
const connectDB = require('../config/connection')
const Wallet = require('../models/wallerModel')


const updateWalletAmount = async(total,userId)=>{
   
    try {
        await connectDB()
       
        const wallet = await Wallet.findOne({userId:userId})
       
        if(!wallet){
            wallet = new Wallet({
                userId:userId,
                balance:total
            })
            await wallet.save()
     
        }else{
            const updatedAmount = wallet.balance + total

            await Wallet.findByIdAndUpdate({userId:userId},{$set:{balance:'updatedAmount'}});
      
        }
    } catch (error) {
    }
}

const getWallet = async (userId) => {
    try {
        let wallet = await Wallet.findOne({ userId: userId })

        if (!wallet) {
            wallet = new Wallet({
                userId: userId,
                balance: 0 
            })
            await wallet.save()
        }
        return wallet
    } catch (error) {
        console.log(error, 'cannot get wallet');
    }
}




module.exports = {
    updateWalletAmount,
    getWallet
}