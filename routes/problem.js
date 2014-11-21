var express = require('express');
var router = express.Router();

var nav = [
	{ name: '首页', ref: '/', active: true },
	{ name: '问题', ref: '/problem', active: false },
	{ name: '状态', ref: '/status', active: false },
	{ name: '比赛', ref: '/contest', active: false },
	{ name: '排名', ref: '/ranklist', active: false }
            ];

router.get('/', function(req, res) {
    res.render('problem', { title: '问题 - CodeBursts', nav: nav });
});

module.exports = router;

