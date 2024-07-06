const mongoose = require('mongoose');


const productHistory=new mongoose.Schema({productId:{
    type: mongoose.SchemaTypes.ObjectId,
    ref:'Product',
    required:true
}
  ,timeStamp:{type:Date,default:Date.now}});


const userData=new mongoose.Schema({
     userid:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
     },
     productHistory:[productHistory]
});


module.exports = mongoose.model("Userdata", userData);