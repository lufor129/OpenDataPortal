var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoClient=require('mongodb').MongoClient;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var searchRouter = require('./routes/search');
var monthlyRouter = require("./routes/monthly");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/Search',searchRouter);
app.use("/monthly",monthlyRouter);

app.get("/allDataSet",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    db.collection("taipei",function(err,collection){
      collection.find().toArray(function(err,items){
          if(err){
            res.send("發生錯誤")
          }
          resData = {"message":"success","code":200,"resultNumber":items.length,"content":items}
          res.send(resData);
          client.close();
      });
    });
  });  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
