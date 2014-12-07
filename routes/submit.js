var express = require('express');
var router = express.Router();
var cr = require('../model/core');
var fs = require('fs');
var cp = require('child_process');
var Step = require('step');
var judger = require('../model/judger');

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
    else {
        var title = '提交 - CodeBursts';
        res.render('submit', { title: title, problemId: '', nav: nav });
    }
});

router.get('/success', function(req, res) {
    res.render('submit/success', { title: '提交成功 - CodeBursts', nav: nav     });
});

router.get('/failure', function(req, res) {
    res.render('submit/failure', { title: '提交失败 - CodeBursts', nav: nav     });
});

router.post('/', function(req, res) {
    if (!req.session.user) {
        res.redirect(302, '/submit/failure');
        res.end();
        return;
    }
    res.redirect(302, '/status');
    res.end();
    var problemId = req.param('problemId');
    var language = req.param('Language');
    var code = req.param('code');
    Step(
        function() {
            cr.querySubmissionNum(this);
        },
        function(err, sum) {
            var submission =
            {
                problemId: problemId,
                language: language,
                code: code,
                submissionId: sum + 1,
                user: req.session.user.username
            };
            cr.addSubmission(submission, this);
        },
        function() {
            fs.exists(__dirname + '/../../judger/judge.lock', this);
        },
        function(exists) {
            if (!exists) {
                judger.doJudge();
            }
        }
    );
});

router.get('/:problemId', function(req, res) {
    if (!req.session.user) {
        res.render('login', { title: '登陆 - CodeBursts', nav: nav });
        return;
    }
    var problemId = req.params.problemId;
    var title = problemId + ' - 提交 - CodeBursts';
    res.render('submit', { title: title, problemId: problemId, nav: nav });
});

module.exports = router;
