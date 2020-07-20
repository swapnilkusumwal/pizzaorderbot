var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var http = require('http');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var orderRouter = require('./routes/orderRouter');
var trackRouter = require('./routes/trackRouter');
var deleteRouter = require('./routes/deleteRouter');
var updateRouter = require('./routes/updateRouter');
var app = express();
var cors=require('cors');
var dotenv=require('dotenv');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

const connection=mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology: true,useNewUrlParser: true});
connection.then(db=>console.log("Connected"));

app.use(cors());
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order', orderRouter);
app.use('/track', trackRouter);
app.use('/delete', deleteRouter);
app.use('/update', updateRouter);

if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname, 'client/build')));
}

var PORT = process.env.PORT || '3001';
app.listen(PORT, console.log(`Server is starting at ${PORT}`));

module.exports = app;
//Rajatsonu123%2B%0A