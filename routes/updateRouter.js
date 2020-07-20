const express=require('express');
const bodyParser=require('body-parser');
const Order=require('../model/order');
const updateRouter=express.Router();

updateRouter.route('/')
.post((req,res)=>{
  console.log(req.body);
  if(req.body.adminPassword!=="Admin123+"){
    res.json({"found":'error'});
  }
  if(req.body.adminOrderId===''){
    res.json({"found":'error'});
  }
  Order.findOneAndUpdate({_id:req.body.adminOrderId},{$set:{status:req.body.adminStatus}},{new:true})
  .then(data=>{
    res.setHeader("Content-type","application/json");
    if(data!==null)
      res.statusCode=200;
    else{
      res.json({"found":"error"});
    }
    if(data===null)
      res.json({'found':'error'})
    res.json(data);
  })
  .catch(err=>res.json({"found":"error","error":err}))
})
module.exports=updateRouter;