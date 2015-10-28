var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
var user = require('../model/user').user;
//mongoose.connect('mongodb://localhost/hello');

/*login*/
router.get('/', function(req, res) {
  res.render('login.ejs', { title: '系统登录' });
});
router.get('/login', function(req, res) {
  res.render('login.ejs', { title: '系统登录' });
});
/*logout*/
router.get('/logout', function(req, res) {
  res.render('logout.ejs', { title: 'logout' });
});
/*homepage*/
router.post('/homepage', function(req, res) {
  var query_doc = {userid: req.body.userid, password: req.body.password};

  (function(){
    user.count(query_doc, function(err, doc){
      if(doc == 0){
        console.log("====="+doc);
        console.log(query_doc.userid + ": login success in " + new Date());
        res.render('homepage.ejs', { title: 'homepage' });
      }else{
        console.log(query_doc.userid + ": login failed in " + new Date());
        res.redirect('/');
      }
    });
  })(query_doc);
})
module.exports = router;
