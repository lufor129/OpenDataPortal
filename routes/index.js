var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;
  console.log(session.id)
  if (!session.num) {
    session.num = 0;
  }
  console.log(++session.num);
  res.render('index', { title: `Express這是第 ${session.num} 次訪問` });
});



module.exports = router;
