var express = require('express');
var router = express.Router();
var MongoClient=require('mongodb').MongoClient;

function getLastMonth(){
  var dt = new Date;
  var month = dt.getMonth();
  if(month-1 < 0){
    return String(dt.getFullYear()-1)+"-12"
  }else{
    if(month<10){
      return String(dt.getFullYear())+"-0"+String(month)
    }else{
      return String(dt.getFullYear())+"-"+String(month)
    }
  }
}


router.get("/NewDataSet",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    db.collection("monthlyLog",function(err,collection){
      month = getLastMonth()
      collection.find({"date":month,"new":true}).toArray(function(err,items){
          if(err){
            res.send("發生錯誤")
          }
          if(items.length==0){
            res.send({"message":"success","code":200,"content":"結果為空","resultNumber":0})  
          }else{
            resData = {"message":"success","code":200,"resultNumber":items[0].content.length,"content":items[0].content}
            res.send(resData);
          } 
          client.close();
      });
    });
  });  
});

router.get("/DeleteDataSet",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    db.collection("monthlyLog",function(err,collection){
      month = getLastMonth()
      collection.find({"date":month,"new":false}).toArray(function(err,items){
          if(err){
            res.send("發生錯誤")
          }
          if(items.length==0){
            res.send({"message":"success","code":200,"content":"結果為空","resultNumber":0})
          }else{
            resData = {"message":"success","code":200,"resultNumber":items[0].content.length,"content":items[0].content}
            res.send(resData);
          }
          client.close();
      });
    });
  });  
});

router.get("/DeleteDataSet",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    db.collection("monthlyLog",function(err,collection){
      month = getLastMonth()
      collection.find({"date":month,"new":false}).toArray(function(err,items){
          if(err){
            res.send("發生錯誤")
          }
          if(items.length==0){
            res.send({"message":"success","code":200,"content":"結果為空","resultNumber":0})
          }else{
            resData = {"message":"success","code":200,"resultNumber":items[0].content.length,"content":items[0].content}
            res.send(resData);
          }
          client.close();
      });
    });
  });  
});

router.get("/MonDelNum",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    pipeline = [
      {"$match":{"new":false}},
      {$project:{"date":1,"new":1,"_id":0,"NumOfContent":{$size:"$content"}}}
    ]
    db.collection("monthlyLog",function(err,collection){
      month = getLastMonth()
      collection.aggregate(pipeline).toArray(function(err,items){
          if(err){
            res.send("發生錯誤")
          }
          if(items.length==0){
            res.send({"message":"success","code":200,"content":"結果為空","resultNumber":0})
          }else{
            resData = {"message":"success","code":200,"resultNumber":items.length,"content":items}
            res.send(resData);
          }
          client.close();
      });
    });
  });  
});

router.get("/MonNewNum",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    pipeline = [
      {"$match":{"new":true}},
      {$project:{"date":1,"new":1,"_id":0,"NumOfContent":{$size:"$content"}}}
    ]
    db.collection("monthlyLog",function(err,collection){
      month = getLastMonth()
      collection.aggregate(pipeline).toArray(function(err,items){
          if(err){
            res.send("發生錯誤")
          }
          if(items.length==0){
            res.send({"message":"success","code":200,"content":"結果為空","resultNumber":0})
          }else{
            resData = {"message":"success","code":200,"resultNumber":items.length,"content":items}
            res.send(resData);
          }
          client.close();
      });
    });
  });  
});


module.exports = router;
