var express = require('express');
var router = express.Router();
var p = require('../model/problem');
var ps = require('../model/problems');
var Step = require('step');

var db = require('../model/dbquery');

var nav = [
    { name: '管理首页', ref: '/admin', active: true },
    { name: '管理用户', ref: '/admin/users', active: false },
    { name: '管理问题', ref: '/admin/problems', active: false },
    { name: '管理比赛', ref: '/admin/contests', active: false },
            ];

function checkAvail(req, res, callback) {
    if (!req.session.user) {
        res.render('login', { title: '登陆 - CodeBursts', nav: nav });
        return;
    }
    var username = req.session.user.username;
    db.getUserByName(username, function(err, doc) {
        if (doc.admin == true) callback();
        else {
            res.render('login', { title: '登陆 - CodeBursts', nav: nav });
            return;
        }
    });
}

router.get('/', function(req, res) {
    checkAvail(req, res, function() {
        for (x in nav) {
            nav[x].active = false;
        }
        nav[0].active = true;
        res.render('admin', { title: '管理 - CodeBursts', nav: nav });
    });
});

router.get('/users', function(req, res) {
    checkAvail(req, res, function() {
        for (x in nav) {
            nav[x].active = false;
        }
        nav[1].active = true;
        res.render('admin/users', { title: '管理用户 - CodeBursts', nav: nav});
    });
});

var perPage = 100;
var problems = {};
var problem = {};

function getProblems(pageId, callback) {
    p.fetchProblems(1 + perPage * (pageId - 1), perPage, function(err, doc) {
        if (err) return;
        problems = doc;
        callback();
    });
}

function getProblemIndex(problemId, callback) {
    p.fetchProblems(problemId - 1000, 1, function(err, doc) {
        if (err) return;
        if (doc) callback(err, doc[0]);
        else callback(err, null);
    });
}

function getProblem(problemId, callback) {
    ps.fetchProblem(problemId, function(err, doc) {
        if (err) return;
        problem = doc;
        callback();
    });
}

router.get('/problems', function(req, res) {
    checkAvail(req, res, function() {
        for (x in nav) nav[x].active = false;
        nav[2].active = true;
        getProblems(1, function() {
            res.render('admin/problems', { title: '管理问题 - CodeBursts', nav: nav, problems: problems });
        });
    });
});

router.post('/problems/add', function(req, res) {
    checkAvail(req, res, function() {
        var info = {
            name: req.param('index'),
            description: req.param('description'),
            input: req.param('input'),
            output: req.param('output'),
            sampleInput: req.param('sampleInput'),
            sampleOutput: req.param('sampleOutput'),
            title: req.param('title'),
            avail: true
        };
        ps.addProblem(info, function() {
            res.redirect('back');
        });
    });
});

router.post('/problems/edit/submit/:problemId', function(req, res) {
    var problemId = Number(req.params.problemId);
    checkAvail(req, res, function() {
        var info = {
            description: req.param('description'),
            input: req.param('input'),
            output: req.param('output'),
            sampleInput: req.param('sampleInput'),
            sampleOutput: req.param('sampleOutput'),
            title: req.param('title'),
        };
        ps.updateProblem(problemId, info, function() {
            res.redirect('back');
        });
    });
});

router.get('/problems/edit/:problemId', function(req, res) {
    checkAvail(req, res, function() {
        for (x in nav) nav[x].active = false;
        nav[2].active = true;
        var problemId = req.params.problemId;
        Step(
            function() {
                getProblemIndex(Number(problemId), this.parallel());
                getProblem(Number(problemId), this.parallel());
            },
            function(err, doc) {
                res.render('admin/editProblems', { title: problemId + ' - 编辑问题 - CodeBursts', nav: nav, problem: problem, problemIndex: doc });
            }
        );
    });
});

module.exports = router;

