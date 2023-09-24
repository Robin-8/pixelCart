const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        default: 0
    },
    is_varified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: ''
    },
    Blocked:{
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Pending", "Delivered", "Confirmed", "Returned", "Cancelled"],
        default: "Pending"
    },
    Address:[{
        _id: mongoose.Schema.Types.ObjectId,
        fname:{
            type:String,
            required:true
        },
        lname:{
            type:String,
            required:true
        },
        address1:{
            type:String,
            required:true
        },
        address2:{
            type:String,
            // required:true
        },
        towncity:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        mobile:{
            type:Number,
            required:true
        },  
        primary:{
            type:Boolean,
            default:false
          },
    }]
});

module.exports = new mongoose.model('User', userSchema);