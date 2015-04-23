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

var submission, problemId, title;

router.get('/', function(req, res) {
    if (!req.session.user)
        res.render('login', { title: '登陆 - CodeBursts!', nav: nav });
    else {
        var title = '提交 - CodeBursts!';
        res.render('submit', { title: title, problemId: '', nav: nav });
    }
});

router.get('/success', function(req, res) {
    res.render('submit/success', { title: '提交成功 - CodeBursts!', nav: nav     });
});

router.get('/failure', function(req, res) {
    res.render('submit/failure', { title: '提交失败 - CodeBursts!', nav: nav     });
});

router.post('/', function(req, res) {
    if (!req.session.user) {
        res.redirect(302, '/submit/failure');
        res.end();
        return;
    }
    //res.redirect(302, '/status');
    //res.end();
    var problemId = req.param('problemId');
    var language = req.param('Language');
    var code = req.param('code');
    Step(
        function() {
            require('../model/problems').fetchProblem(Number(problemId), this);
        },
        function(err, doc) {
            if (!doc || (!doc.avail && !(req.session.user && req.session.user.admin))) {
                res.render('error', {error: {status: 404, stack: '根本没有这种问题！是假的！'}});
                doc = null;
                return;
            }
            this();
        },
        function() {
            res.redirect('/status');
            res.end();
            this();
        },
        function() {
            cr.querySubmissionNum(this);
        },
        function(err, sum) {
            submission =
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
        res.render('login', { title: '登陆 - CodeBursts!', nav: nav });
        return;
    }
    problemId = req.params.problemId;
    title = problemId + ' - 提交 - CodeBursts!';
    res.render('submit', { title: title, problemId: problemId, nav: nav });
});

module.exports = router;
