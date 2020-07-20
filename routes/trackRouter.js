const express=require('express');
const bodyParser=require('body-parser');
const Order=require('../model/order');
const trackRouter=express.Router();

trackRouter.route('/')
.post((req,res)=>{
  if(req.body.currId==='')
  res.json({"found":"error"});
  Order.findById(req.body.currId)
  .then(data=>{
    res.setHeader("Content-Type","application/json");
    if(data===null){
      res.json({"found":"error"});
    }
    else
      res.statusCode=200;
    res.json(data);
  })
  .catch(err=>res.json({"found":"error","error":err}))
})
module.exports=trackRouter;