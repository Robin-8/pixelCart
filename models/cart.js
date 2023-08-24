const mongoose = require('mongoose');

const cartSchema= new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required:true 
  },
  products:{
    type: [mongoose.Schema.Types.ObjectId],
    required:true
  }
})

module.exports = mongoose.model('Cart', cartSchema);
