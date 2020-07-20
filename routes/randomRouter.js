const express=require('express');
const bodyParser=require('body-parser');
const Order=require('../model/order');
const randomRouter=express.Router();

const pizzas=['margerita','veggie-delight','corn'];
const allData=[];
randomRouter.route('/')

.get((req,res)=>{
  Order.aggregate([
    { $match: { pizza: "margerita",quantity: { $gt: 2 } }},
    {$group:{_id:"$pizza",total:{$push:'$quantity'}}}
  ])
  .then(data=>res.json(data))
})

.post((req,res,next)=>{

  return next(new Promise(()=>{for(var i=0;i<100;i++){
    var data={
      name:"Swapnil",
      number:'8888888888',
      email:'s@gmail.com',
      address:"asdasd",
      pizza:pizzas[parseInt(Math.ceil(Math.random() * 100),10)%3],
      quantity: parseInt(Math.ceil(Math.random() * 100),10)%6
    }
    if(data['quantity']===0)
    data['quantity']=1;
    allData.push(data);
  }})
  
  .then(()=>Order.insertMany(allData)
    .then(data=>{
      res.setHeader('Content-Type','application/json');
      res.statusCode=200;
      res.json(Alldata);
    })
    .catch(err=>{console.log(err);res.json({"found":err})})
    )
  .catch(err=>{console.log(err);res.json({"found":err})}))
})
module.exports=randomRouter;