/**
 * Created by Administrator on 2015/10/28.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function (req, res, next) {
    res.render('index.html', {title: '首页'});
})*/
router.get('/index', function (req, res, next) {
    res.render('index.html', {title: '首页'});
})
router.get('/table', function(req, res, next) {
    res.render('table.ejs', { title: '部门' });
})

router.get('/user', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('users.ejs', { title: 'users123' });
})
module.exports = router;