const mongoose = require('mongoose')

const Category = require('../models/categoryModel')



getAllCategories =async () => {
    try {
      
      return await Category.find().sort({ _id: -1 });
    } catch (err) {
      console.log(err);
    }
  }


  module.exports ={
    getAllCategories,
  
  }