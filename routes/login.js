var express = require('express');
var JSON = require('JSON');
var router = express.Router();
var mauth = require('../lib/auth');
//TODO mauth not completed

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

router.post('/auth', function(req, res) {
    var data = {};
    req.session.username = null;
    req.session.password = null;
    data.username = req.param('username');
    data.password = req.param('password');
    //res.send(JSON.stringify(data));
    var authdata;
    mauth.auth(data.username, function(docs) {
        if (docs.password == data.password) {
            req.session.username = data.username;
        }
        res.status(200).end();
    });
});

module.exports = router;

