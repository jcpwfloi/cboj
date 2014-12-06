var express = require('express');
var router = express.Router();
var stats = require('../model/submission');

var nav = [
	{ name: '首页', ref: '/', active: false },
	{ name: '问题', ref: '/problem', active: false },
	{ name: '状态', ref: '/status', active: true },
	{ name: '比赛', ref: '/contest', active: false },
	{ name: '排名', ref: '/ranklist', active: false }
            ];

router.get('/', function(req, res) {
    stats.getstats(1, function(arr) {
        console.log(arr);
        res.render('status', {status: arr, nav: nav, title: '状态 - CodeBursts'});
    });
});

module.exports = router;

