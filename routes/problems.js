var express = require('express');
var router = express.Router();
var md = require('marked');
var p = require('../model/problems');


var nav = [
	{ name: '首页', ref: '/', active: true },
	{ name: '问题', ref: '/problem', active: false },
	{ name: '状态', ref: '/status', active: false },
	{ name: '比赛', ref: '/contest', active: false },
	{ name: '排名', ref: '/ranklist', active: false }
            ];

router.get('/:problemId', function(req, res) {
    var problemId = Number(req.params.problemId);
    p.fetchProblem(problemId, function(err, doc) {
        console.log(doc);
        res.render('problems', {title: problemId + ' - 问题 - CodeBursts', nav: nav, md: md, doc: doc});
        res.end();
    });
});

module.exports = router;

