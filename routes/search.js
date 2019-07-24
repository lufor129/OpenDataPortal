var express = require('express');
var router = express.Router();
var MongoClient=require('mongodb').MongoClient;


router.get("/SearchByCounty",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    db.collection("taipei",function(err,collection){
      collection.find({"county":req.query.County}).toArray(function(err,items){
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

module.exports = router;