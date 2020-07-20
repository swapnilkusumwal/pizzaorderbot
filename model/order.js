const mongoose=require('mongoose');
const shortid=require('shortid');
const Schema = mongoose.Schema;

const orderSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  number:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  pizza:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default:'pending . . .'
  },
  _id: {
    type: String,
    default: shortid.generate
  }
},{
  timestamps:true
});

const Order=mongoose.model('Order',orderSchema);
module.exports=Order;