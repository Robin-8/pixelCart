const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  totalPrice: {
    required: true,
    type: Number,
  },
  createdOn: {
    required: true,
    type: Date,
    default: Date.now
  },
 
  products:{
    type:Array
  },
  reason: {
    type: String,
    default: 'N/A',
  },
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is the name of your user schema
  },
  payment: {
    required: true,
    type: String,
  },
  status: {
    required: true,
    type: String,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address', // Assuming 'Address' is the name of your address schema
  },
});

module.exports = mongoose.model('Order', orderSchema);
