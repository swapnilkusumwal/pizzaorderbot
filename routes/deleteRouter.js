const express=require('express');
const bodyParser=require('body-parser');
const Order=require('../model/order');
const deleteRouter=express.Router();

deleteRouter.route('/')
.post((req,res)=>{
  if(req.body.currId==='')
  res.json({"found":"error"});
  Order.deleteOne({_id:req.body.currId})
  .then(data=>{
    res.setHeader("Content-Type","application/json");
    res.statusCode=200;
    res.json(data);
  })
  .catch(err=>res.json({"found":"error","error":err}))
})
module.exports=deleteRouter;