var express = require('express');
var JSON = require('JSON');
var router = express.Router();
var db = require('../model/dbquery');

var nav = [
    { name: '首页', ref: '/', active: true },
    { name: '问题', ref: '/problem', active: false },
    { name: '状态', ref: '/status', active: false },
    { name: '比赛', ref: '/contest', active: false },
    { name: '排名', ref: '/ranklist', active: false }
            ];

router.get('/', function(req, res) {
    res.render('login', { title: '登陆 - CodeBursts', nav: nav });
});

router.get('/register', function(req, res) {
    res.render('login/register', { title: '注册 - CodeBursts', nav: nav });
});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('back');
});

router.post('/auth', function(req, res) {
    req.session.user = null;
    var password = req.param('password');
    var username = req.param('username');
    db.getUserByName(username, function(err, docs) {
        if (err) throw err;
        console.log(docs);
        if (!docs) {
            res.send({stat: "failed"});
            res.end();
            return;
        }
        if (docs.pass == password) {
            req.session.user = {
                username: username,
                password: password
            };
            res.send({stat: "success"});
            res.end();
        } else {
            res.send({stat: "failed"});
            res.end();
        }
    });
});

module.exports = router;

