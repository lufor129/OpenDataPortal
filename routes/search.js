var express = require('express');
var router = express.Router();
var MongoClient=require('mongodb').MongoClient;
var request = require("request");

// var fs  = require("fs");
// mongo_dict = {}
// fs.readFile("./titleSource.txt", function(err, f){
//   var array = f.toString().split('\n');
//   array.forEach(function(data){
//     var datas= data.split("_")
//     mongo_dict[datas[0]] = datas[1];
//   })
// });

router.get("/AllCounty",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    db.collection("taipei",function(err,collection){
      collection.distinct("county",{},function(err,items){
          if(err){
            res.send("發生錯誤")
          }
          resData = {"message":"success","code":200,"resultNumber":items.length,"content":items}
          res.send(resData);
          client.close();
      });
    });
  });  
})

router.get("/SearchByCounty",function(req,res){
  MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
    if(err) throw err;
    var db = client.db("opendata")
    db.collection("taipei",function(err,collection){
      county = req.query.County;
      req.session.recomm[String(Date.now())] = county
      collection.find({"county":county}).toArray(function(err,items){
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

router.get("/GetRelatedKey",function(req,res){
  key = req.query.key;
  request.post(global.MLServer+"/keywordSearch",{json:true,body:{"data":key}},function(error,response,body){
    if(body == "error") res.send("沒有相關字")
    else{
      resData = {"message":"success","code":200,"resultNumber":body.length,"content":body}
      res.send(resData)
    } 
  })
});

router.get("/SearchByTitle",function(req,res){
  title = req.query.title;
  req.session.recomm[String(Date.now())] = title
  request.post(global.MLServer+"/singleSentRecomm",{json:true,body:{"num":50,"title":title}},function(error,response,body){
    var _id_ls = body
    _id_ls =_id_ls.map(function(_id){return new ObjectId(_id)})
    // title_ls = _id_ls.map(function(_id){
    //   return mongo_dict[_id]}
    // )
    MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
      if(err) throw err;
      var db = client.db("opendata")
      db.collection("taipei",function(err,collection){
        collection.find({_id:{$in:_id_ls}}).toArray(function(err,items){
          console.log(items)
          client.close()
        })
        // collection.find({title:{$in:title_ls}}).toArray(function(err,items){
        //     res.send(items)
        //     client.close();
        // });
      });
    });
  })  
});

router.get("/personalRecomm",function(req,res){
  var session = req.session;
  
})

module.exports = router;
