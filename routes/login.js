var express = require('express');
var JSON = require('JSON');
var router = express.Router();

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
});

module.exports = router;

