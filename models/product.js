const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Category: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Description: {
    type: [String],
    required:true
  },
  Images: {
    type: Array,
    required: true
  },
  Deleted:{
    type:Boolean,
    default:false
  },
});

module.exports = new mongoose.model('Product', productSchema);




