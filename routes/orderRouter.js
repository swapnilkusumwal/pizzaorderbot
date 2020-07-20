const express=require('express');
const bodyParser=require('body-parser');
const Order=require('../model/order');
const orderRouter=express.Router();

orderRouter.route('/')
.post((req,res)=>{
  Order.create(req.body)
  .then(data=>{
    res.setHeader('Content-Type','application/json');
    if(data===null){
      res.statusCode=400;
      res.json({"found":"error"});
    }
    else
      res.statusCode=200;
    console.log(data);
    res.json(data);
  })
  .catch(err=>res.json({"found":"error","error":err}))
})
module.exports=orderRouter;