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
    required: true
  },
  Images: {
    type: Array,
    required: true
  },
  Stock: {
    type: Number,
    default: 0
  },
  Deleted: {
    type: Boolean,
    default: false
  },
  OfferPrice:{
      type:Number,
      default:0
  }
});

module.exports = mongoose.model('Product', productSchema);
