var express = require('express');
var router = express.Router();
var mydb;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/display_actor', function(req, res, next) {
  res.render('display_actor');
});

router.get('/register_actor', function(req, res, next) {
  res.render('register_actor');
});

router.post('/register_actor', function(req, res, next) {
  var userName = request.body.name;
  var id = request.body.id;
  if(!mydb) {
    console.log("No database.");
    //response.send("No database!");
    return;
  }
  mydb.insert({ "name" : userName, "id" : id }, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }
    //response.send("New entry in the database.");
  });
});

module.exports = router;
