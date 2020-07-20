import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import axios from 'axios';
const questions= ["Hello, are you looking to order a delicious pizza?",
                  "Which pizza would you like to order?",
                  'Please enter exact name of the pizza.Did you mean any of these?',
                  "Kindly tell us your name.",
                  "Where would you like us to deliver it to?",
                  "Please enter your contact number.",
                  "Please enter your email id",
                  "Your details are as follows:",
                  "Place order?",
                  "Press enter to get your order ID.\nIf order ID does not appear, please press enter again.",
                  "Happy Pizza-ing!"];
const pizza=['margerita','veggie-delight','corn']
const answerHelper=['Yes/No',`Name Of Pizza [${pizza}] only`,
                    "Please enter exact name",
                    'Your Name','Your address',
                    'Please enter your phone number',
                    'Please enter your email id',
                    'Yes/No','Yes/No','Enjoy your pizza',
                    'Refresh page to place new order']

var maybePizza=[];
var orderId='';
var once=0;
const Conversation=({index,data,allConvo,resetState})=>{
  if(index===3){
    maybePizza=pizza.filter((curr)=>curr.toLowerCase().includes(data.toLowerCase()))
    if(maybePizza.length===0)
      maybePizza=pizza;
    return(
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <p>{data}</p>
        </div>
    )
  }
  else if(index===4){
    return(
      <div>
          <p>{data}</p>
          <ul>{maybePizza.map((curr)=><li key={curr}>{curr}</li>)}</ul>
      </div>
    )
  }
  else if(index===14)
    return(
      <div>
        <p>{data}</p>
        <p>Name: {allConvo[7]}</p>
        <p>Ph. Number: {allConvo[11]}</p>
        <p>Email: {allConvo[13]}</p>
        <p>Address: {allConvo[9]}</p>
        <p>Pizza: {allConvo[5]}</p>
      </div>
  );
  else if(index===18 && !once)
  {
    once=1;
    var temp={
      name:allConvo[7],
      number:allConvo[11],
      email:allConvo[13],
      address:allConvo[9],
      pizza:allConvo[5]
    };
    axios({
      url: '/order',
      method: 'POST',
      data: temp
    })
    .then(response=>{
      var res=response.data;
      if(res['found']==='error'){
        alert("Please place your order again.\nThere was some error in your details.");
        resetState();
      }
      orderId=res['_id'];
    })
    .catch(err=>console.log(err))
    return(
      <div>
        <p>{data}</p>
      </div>
    )
  }
  else if(index===19){
    return(
      <>
        <div>
          <p>{orderId}</p>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <p>{data}</p>
        </div>
      </>
    )
  }
  else if(index%2===0){
    return(
      <div>
        <p>{data}</p>
      </div>
    );
  }
  else{
    return(
      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <p>{data}</p>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      index:0,
      name:'',
      number:'',
      address:'',
      conversation:[questions[0]],
      currentResponse:'',
      page:0,//0 for chat page 1 for track page 2 for edit page
      details:'No details to show',
      currId:'',
      adminOrderId:'',
      adminPassword:'',
      adminStatus:''
    }
  }
  async componentDidMount() {
    
    await $("#chatBox").ready(function(){
      $("#chatBox").animate({opacity:0.8,height:'50vh'},800)
    })
    await document.getElementById("logo").animate([
      { transform: 'translateY(1000px)' }, 
      { transform: 'translateY(0px)' }
    ], { 
      duration: 800,
      iterations: 1
    });
    await document.getElementById("track").animate([
      { transform: 'translateY(1000px)' }, 
      { transform: 'translateY(0px)' }
    ], { 
      duration: 800,
      iterations: 1
    });
    await document.getElementById("track1").animate([
      { transform: 'translateY(1000px)' }, 
      { transform: 'translateY(0px)' }
    ], { 
      duration: 800,
      iterations: 1
    });
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount = () => {
      document.removeEventListener('keydown', this.handleKeyPress)
  }
  handleKeyPress=async(key)=>{
    if(key.key==="Enter"){
      await this.handleAnswer();
      this.setState({currentResponse:''})
    }
  }
  handleAnswer=async()=>{
    var tempResponse=this.state.currentResponse.toLowerCase();
    if(tempResponse==="no" && this.state.index!==3)
    {
      this.setState({conversation:[questions[0]],index:0,
      name:0,number:'',address:'',currentResponse:''})
    }
    else
    {
      await this.setState({index:this.state.index+1})
      var tempConvo=this.state.conversation;
      await tempConvo.push(this.state.currentResponse);
      if(this.state.index<11){
        await tempConvo.push(questions[this.state.index]);
      }
      else
        await tempConvo.push(questions[10])
      await this.setState({conversation:tempConvo,currentResponse:''});
      
    }
  }

  handleTrack=async()=>{
    axios({
      url: '/track',
      method: 'POST',
      data: {currId:this.state.currId}
    })
    .then((response)=>{
      var val=response.data;
      if(val.found!=='error'){
        this.setState({details:val})
        this.setState({page:1})
      }
      else{
        alert("Please check you order Id again.");
      }
    })
  }

  handleDelete=async()=>{
    axios({
      url: '/delete',
      method: 'POST',
      data: {currId:this.state.currId}
    })
    .then(response=>response.data)
    .then((val)=>{
      if(val){
        this.setState({
          index:0,
          name:'',
          number:'',
          address:'',
          conversation:[questions[0]],
          currentResponse:'',
          page:0,//0 for chat page 1 for track page 2 for edit page
          details:'No details to show',
          currId:'',
          adminOrderId:'',
          adminPassword:'',
          adminStatus:''
        })
      }
      alert("Order Cancelled!\nPlease refresh page to place new order!");
      this.setState({page:0});
    })
  }

  handleAdminUpdate=async()=>{
    axios({
      url: '/update',
      method: 'POST',
      data: this.state
    })
    .then(response=>response.data)
    .then(data=>{
      if(data['found']==='error')
      alert("Please check the details!");
      else{
        alert('Update successful!');
        this.setState({adminOrderId:'',adminPassword:'',adminStatus:''})
      }
    })
  }

  render(){
    if(this.state.page===0)
    return (
      <>
      <div style={styles.background}>
        <div style={styles.logo} >
          <img src="yoyo.jpg" height="125" alt="logo" id="logo" />
        </div>
        <div style={styles.center} >
          <div className="col-9 col-md-6 col-sm-8" style={styles.chatBox} id="chatBox">
            {this.state.conversation.map((data,index)=>{
              return<Conversation data={data} index={index} 
                allConvo={this.state.conversation} key={index} 
                resetState={()=>this.setState({
                  index:0,
                  name:'',
                  number:'',
                  address:'',
                  conversation:[questions[0]],
                  currentResponse:'',
                  page:0,//0 for chat page 1 for track page 2 for edit page
                  details:'No details to show',
                  currId:'',
                  adminOrderId:'',
                  adminPassword:'',
                  adminStatus:''
                })}
                />
            })}
            <div style={styles.inputArea}>
              <input style={{width:'100%',marginRight:5,marginBottom:5 }} placeholder={answerHelper[this.state.index]}
              value={this.state.currentResponse} onChange={(event)=>{this.setState({currentResponse:event.target.value});}}/>
              <button className="btn btn-primary" onClick={this.handleAnswer} style={{height:30,display:'flex',alignItems:'center',marginBottom:5}}>Submit</button>
            </div>
          </div>
        </div>
        <div  style={{display:'flex',justifyContent:'center',margin:5}}>
            <input value={this.state.currId} placeholder="Enter order Id" style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({currId:event.target.value})}/>
            <button id="track" onClick={this.handleTrack} className="btn btn-primary" style={{margin:5}}>Track Order</button>
        </div>
        <div style={styles.center}>
            <textarea rows='1' placeholder="orderId" value={this.state.adminOrderId}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminOrderId:event.target.value})}/>
            <textarea rows='1' placeholder="Status" value={this.state.adminStatus}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminStatus:event.target.value})}/>
            <textarea rows='1' placeholder="Password" type="password" value={this.state.adminPassword}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminPassword:event.target.value})}/>
            <button id="track1" onClick={this.handleAdminUpdate} className="btn btn-primary" style={{margin:5}}>Admin Update</button>
        </div>
      </div>
    </>
    );
    else if(this.state.page===1)
    return(
      <div style={styles.background1}>
        <div style={{backgroundColor:'#d8d8d8',color:'black',width:'50vw'}} className="text-center">
          <p>Name:  {this.state.details['name']}</p>
          <p>Ph. Number:  {this.state.details['number']}</p>
          <p>Address: {this.state.details['address']}</p>
          <p>Pizza: {this.state.details['pizza']}</p>
          <p>Order Id:  {this.state.details['_id']}</p>
          <p>Status:  {this.state.details['status']}</p>
        </div>
        <div style={{flexDirection:'row'}}>
          <button onClick={()=>this.setState({page:0})} style={{margin:5}}className="btn btn-primary">Go back</button>
          <button className="btn btn-danger" onClick={this.handleDelete}>Cancel Order</button>
        </div>
      </div>
    )
  }
}

const styles={
  center1:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column'
  },
  background1:{
    width:'100vw',
    height:'100vh',
    backgroundColor:"#1d1d1d",
    display:'flex',
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column'
  },
  background:{
    backgroundImage:`url(${require("./background_image.jpg")})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width:'100vw',
    height:'100vh',
    opacity:0.8
  },
  chatBox:{
    backgroundColor:'#fff',
    height:'40vh',
    width:'70vw',
    opacity:0.8,
    overflowY: 'scroll'
  },
  inputArea:{
    display:'flex',
    alignItems:'flex-end',
    paddingBottom:1,
    overflowY: 'scroll'
  },
  logo:{
    display:'flex',
    justifyContent:'center',
    alignItems:'flex-end',
    paddingTop:10,
    marginBottom:10,
  },
  center:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  }
}
export default App;
{/*
<div style={{display:'flex',justifyContent:'center',margin:5}}>
          <div className="row">
            <div className="col-3"></div>
            <div style={{width:125,margin:5}}> 
              <input placeholder="Enter order Id" value={this.state.adminOrderId}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminOrderId:event.target.value})}/>
              <input placeholder="Enter password" type="password" value={this.state.adminPassword}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminPassword:event.target.value})}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              <div style={{width:10}}>
                <input placeholder="Enter status" value={this.state.adminStatus}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminStatus:event.target.value})}/>
              </div>
              <div style={{width:150}}>
                <button id="track1" onClick={this.handleAdminUpdate} className="btn btn-primary" style={{margin:5}}>Admin Update</button>
              </div>
            </div>
          </div>
        </div>


        <div style={{display:'none',justifyContent:'center',margin:5}}>
          <input placeholder="Enter order Id" value={this.state.adminOrderId}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminOrderId:event.target.value})}/>
          <input placeholder="Enter password" type="password" value={this.state.adminPassword}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminPassword:event.target.value})}/>
          <input placeholder="Enter status" value={this.state.adminStatus}  style={{margin:5,opacity:0.7}} onChange={(event)=>this.setState({adminStatus:event.target.value})}/>
          <button id="track1" onClick={this.handleAdminUpdate} className="btn btn-primary" style={{margin:5}}>Admin Update</button>
        </div>
*/}