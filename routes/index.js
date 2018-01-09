var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var dbUsers = 'usersKoricancha'
var mongodb = require('mongodb');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection(dbUsers).find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});
router.get('/showUser/:id',function(req,res,next){
  var o_id = mongodb.ObjectID(req.params.id);
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection(dbUsers).findOne({"_id": o_id},function(err,result){
      res.render('userInfo',result)
    });
  })
})

router.get('/showId/:id',function(req,res,next){
  res.end(req.params.id);
})

router.get('/formUser',function(req, res, next){
  res.render('formUser');
})

router.post('/insert', function(req, res, next) {
  var item = {
    userName: req.body.userName,
    addr: req.body.addr,
    tel: req.body.tel,
    motherName: req.body.motherName
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection(dbUsers).insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });
  res.redirect('/');
});

////////////////////////////////////////////////////
router.post('/updateUser/:id',function(req,res,next){
  var o_id = mongodb.ObjectID(req.params.id);
  var insertion = {}
  if(req.body.userNameBox) insertion["userName"] = req.body.userNameBox;
  if(req.body.addrBox) insertion["addr"] = req.body.addrBox;
  if(req.body.telBox) insertion["tel"] = req.body.telBox;
  if(req.body.motherNameBox) insertion["motherName"] = req.body.motherNameBox;
  
   mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection(dbUsers).updateOne({"_id": o_id},{$set:insertion})
    res.redirect('/');
  })

  console.log(req.body.userNameBox)
  console.log(req.body.addrBox)
  console.log(req.body.telBox)
  console.log(req.body.motherNameBox)
  console.log(req.params.id)
})



router.get('/deleteCollection',function(req, res, next){
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection(dbUsers).remove({},function(){
      res.redirect('/');
    })
  });
})


module.exports = router;
