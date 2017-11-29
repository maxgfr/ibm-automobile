var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/display_actor', function(req, res, next) {
  res.render('display_actor');
});

router.get('/get_actor', function(req, res, next) {
    var data = [];
    if(!mydb) {
        res.json(data);
        return;
    }

  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
        body.rows.forEach(function(row) {
            if(row.doc.name && row.doc.id)
                data.push({id: row.doc.id, name: row.doc.name});
        });
      res.json(data);
    }
  });
});

router.get('/register_actor', function(req, res, next) {
  res.render('register_actor');
});

router.post('/register_actor', function(req, res, next) {
  var userName = req.body.name;
  var id = req.body.id;
  //console.log(mydb);
  if(!mydb) {
    res.send("Pas de database...");
    return;
  }
  mydb.insert({ "name" : userName, "id" : id }, function(err, body, header) {
    if (err) {
      return null; res.send('[mydb.insert] ', err.message);
    }
    res.send("Nouvelle entrée dans la base de donnée :)");
  });
});

module.exports = router;
