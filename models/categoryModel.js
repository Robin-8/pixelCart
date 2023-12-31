const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
    collation: { locale: 'en', strength: 2 }
    },
    description:{
        type:String,
        required:true
    }
})
module.exports =new mongoose.model('Category',CategorySchema)
