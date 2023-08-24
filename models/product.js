const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Description: {
    type: [String],
    default: [],
  },
  Images: [{
    data: Buffer,
    contentType: {
      type: String,
      default: 'image/jpeg',
    }
  }],
  Deleted:{
    type:Boolean,
    default:false
  },
});

module.exports = mongoose.model('Product', productSchema);




