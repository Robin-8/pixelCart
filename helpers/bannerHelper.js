const connectDB = require('../config/connection')
const Banner= require('../models/bannerModel')


const adminGetAllBanner = async()=>{
    try {
        await connectDB()
        return await Banner.find().sort({_id:-1})
    } catch (error) {
        console.log(error);
    }
}
const getBannerById = async(id)=>{
    try {
        await connectDB()
        return await Banner.findById(id)
    } catch (error) {
        console.log(error);
    }
}

const addBanner = async(bannerDetails)=>{
    try {
        await connectDB()
        return await Banner.create(bannerDetails)
    } catch (error) {
        console.log(error,'cannot add banner');
    }
}

const userGetBanner = async()=>{
    try {
        await connectDB()
        return await Banner.find({isDeleted:false})
    } catch (error) {
        console.log(error,'user cannot find banner');
    }
}
const updateBanner = async(bannerId,bannerDetails)=>{
    try {
     
        await connectDB()
        const updateBanner = await Banner.findByIdAndUpdate(bannerId,bannerDetails,{new:true})
       
        if(updateBanner){
            return updateBanner;
        }else{
            return null
        }
    } catch (error) {
        console.log(error,'faild to update banner');
    }
}
const softDeleteBanner = async(bannerId)=>{
    try {
        await connectDB()
        const bannerDelete = await Banner.findByIdAndUpdate(bannerId,{isDeleted:true},{new:true})
        if(bannerDelete){
            return bannerDelete;
        }else{
            return null
        }
    } catch (error) {
        console.log(error,'failed to delete banner');
    }
}
const softRecoverBanner = async(bannerId)=>{
    try {
        await connectDB()
        const recoverBanner = await Banner.findByIdAndUpdate(bannerId,{isDeleted:false},{new:true})
        if(recoverBanner){
            return recoverBanner
        }else{
            return null
        }
    } catch (error) {
        console.log(error,'cannot recover banner');
    }

}

module.exports = {
    addBanner,
    adminGetAllBanner,
    getBannerById,
    userGetBanner,
    updateBanner,
    softDeleteBanner,
    softRecoverBanner
}