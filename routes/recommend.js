var express = require('express');
var router = express.Router();
var request = require("request")
var MongoClient=require('mongodb').MongoClient;
var ObjectId = require("mongodb").ObjectId;

// var fs  = require("fs");
// mongo_dict = {}
// fs.readFile("./titleSource.txt", function(err, f){
//   var array = f.toString().split('\n');
//   array.forEach(function(data){
//     var datas= data.split("_")
//     mongo_dict[datas[0]] = datas[1];
//   })
// });

router.get("/singleSentRecomm",function(req,res){
  var num = req.query.num;
  var title = req.query.title;
  request.post(global.MLServer+"/singleSentRecomm",{json:true,body:{"num":parseInt(num),"title":title}},function(error,response,body){
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
          res.send(items)
          client.close()
        })
        // collection.find({title:{$in:title_ls}}).toArray(function(err,items){
        //     res.send(items)
        //     client.close();
        // });
      });
    });
  })
})

router.get("/personalRecomm",function(req,res){
  console.log(req.session.recomm)
  request.post(global.MLServer+"/personalRecomm",{json:true,body:req.session.recomm},function(error,response,body){
    now = Date.now()
    data = {}
    body.forEach(function(ls){
      if(ls.length>0){
        diff_time = now - parseInt(ls[0].split("_")[0])
        data[diff_time] = ls.map(function(_id){
          _id_sp = _id.split("_")
          // +"_"+_id_sp[2] 
          return _id_sp[1]
        })
      }
    })
    mother = 0;
    for(let i in data) mother+=parseFloat(i)
    _id_ls = []
    for(let i in data){
      chance = -Math.log10(parseFloat(i)/mother)
      for(let j in data[i]){
        rand = Math.random()
        if(rand<chance) _id_ls.push(data[i][j])
      }
    }
    // title_result = id_ls.map(function(_id){ return mongo_dict[_id] })
    _id_ls =_id_ls.map(function(_id){return new ObjectId(_id)})
    MongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true },function(err,client){
      if(err) throw err;
      var db = client.db("opendata")
      db.collection("taipei",function(err,collection){
        collection.find({_id:{$in:_id_ls}}).toArray(function(err,items){
          res.send(items)
          client.close()
        })
        // collection.find({title:{$in:title_result}}).toArray(function(err,items){
        //     res.send(items)
        //     client.close();
        // });
      });
    });
  })
})

module.exports = router;
