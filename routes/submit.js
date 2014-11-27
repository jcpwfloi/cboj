var express = require('express');
var router = express.Router();
var cr = require('../model/core');

var nav = [
	{ name: '首页', ref: '/', active: true },
	{ name: '问题', ref: '/problem', active: false },
	{ name: '状态', ref: '/status', active: false },
	{ name: '比赛', ref: '/contest', active: false },
	{ name: '排名', ref: '/ranklist', active: false }
            ];

router.get('/', function(req, res) {
    if (!req.session.user)
        res.render('login', { title: '登陆 - CodeBursts', nav: nav });
    else
        res.render('submit', { problemId: '', nav: nav });
});

router.get('/success', function(req, res) {
    res.send('Hello World');
    res.end();
});

router.post('/', function(req, res) {
    res.redirect(301, '/submit/success');
    res.end();
    var problemId = req.param('problemId');
    var language = req.param('Language');
    var code = req.param('code');
    cr.querySubmissionNum(function(err, doc) {
        var submissionNum;
        if (!doc) submissionNum = 0; else submissionNum = doc.value;
        //TODO add a submission, lun xun! (wo yi jing fang qi zhi liao le)
        var submission = {
            problemId: problemId,
            language: language,
            code: code,
            submissionId: submissionNum + 1
        };
    });
});

router.get('/:problemId', function(req, res) {
    if (!req.session.user) {
        res.render('login', { title: '登陆 - CodeBursts', nav: nav });
        return;
    }
    var problemId = req.params.problemId;
    res.render('submit', { problemId: problemId, nav: nav });
});

module.exports = router;
