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
  // date: {
  //   required: true,
  //   type: Date,
  //   default: Date.now
  // },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming 'Product' is the name of your product schema
      },
      size: String, // Add size field if needed
      // Add other fields specific to the product within the order
    },
  ],
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
