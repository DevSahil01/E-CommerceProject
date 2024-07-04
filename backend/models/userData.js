const mongoose = require('mongoose');
const { Schema } = mongoose;


const productHistory=new Schema({productId:String,timeStamp:{type:Date,default:Date.now}});


const userData=new Schema({
     userid:{
        type:String
     },
     productHistory:[productHistory]
});


module.exports = mongoose.model("userData", userData);