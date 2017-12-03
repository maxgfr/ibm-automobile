var express = require('express');
var router = express.Router();

/**** CONVERSATION ****/
router.get('/', function(req, res, next) {
    res.io.on('connection', function(socket){
        console.log('Connexion effectuée');
        socket.on('new_message', function(msg){
            //console.log('Le message: ' + msg);
            //res.io.emit('new_message', msg);
            if(!conversation) {
                res.send("Pas de conversation...");
                return;
            }
            conversation.message({
                input: { text: msg },
                workspace_id: '4f4f881e-d5c9-484e-ba14-1e73ba9dce8c'
            }, function(err, response) {
                if (err) {
                   console.error(err);
               } else {
                   //console.log(response);
                   //console.log(response.output);
                   res.io.emit('new_message', response.output.text);
               }
           });
        });
    });
    res.render('index');
});
/**** CONVERSATION ****/

router.get('/display_actor', function(req, res, next) {
  res.render('display_actor');
});

router.get('/register_actor', function(req, res, next) {
  res.render('register_actor');
});

/**** CLOUDANT  ****/
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
        data.push({id: row.doc.id, name: row.doc.name, id_cloudant : row.doc._id});
      });
      res.json(data);
    }
  });
});

router.delete('/get_actor', function(req, res, next) {
  var id = req.body.id_cloudant;

  var query = { selector: { _id: id}};
  mydb.find(query, function(err, data) {
    if(!err) {
      console.log(data,data.docs, data.docs[0], data.docs[0]["_rev"]);
      mydb.destroy(id, data.docs[0]["_rev"],function(err, body, header) {
        if (!err) {
          console.log("Element supprimé avec success", id);
        }
        res.json(id);
      });
    }
  });

});
/**** CLOUDANT ****/

module.exports = router;
