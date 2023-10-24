const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    history: [
        {
            description: {
                type: String,
                required:true
            },
            price:{
                type:Number,
                required:true
            }

        }]
})

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet;