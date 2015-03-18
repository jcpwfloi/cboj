var express = require('express');
var router = express.Router();
var md = require('marked');
var p = require('../model/problems');


var nav = [
	{ name: '首页', ref: '/', active: false },
	{ name: '问题', ref: '/problem', active: true },
	{ name: '状态', ref: '/status', active: false },
	{ name: '比赛', ref: '/contest', active: false },
	{ name: '排名', ref: '/ranklist', active: false }
            ];

router.get('/:problemId', function(req, res) {
    var problemId = Number(req.params.problemId);
    var user;
    if (req.session.user)
        user = req.session.user;
    p.fetchProblem(problemId, function(err, doc) {
        if ((doc && doc.avail) || (doc && doc.avail == false && user && user.admin)) res.render('problems', { problemId: problemId, title: problemId + ' - 问题 - CodeBursts', nav: nav, md: md, doc: doc, login: user});
        else {
            if (doc && doc.avail == false) {
                var error = {status: '权限狗专用入口', stack: '玛雅这是权限题！少侠请回吧……要权限请联系jcpwfloi@163.com'};
                res.render('error', {error: error});
            } else {
                var error = {status: 404, stack: '404 not found'};
                res.render('error', {error: error});
            }
        }
    });
});

module.exports = router;

