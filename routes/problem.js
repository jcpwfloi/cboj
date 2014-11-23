var express = require('express');
var router = express.Router();

var nav = [
	{ name: '首页', ref: '/', active: true },
	{ name: '问题', ref: '/problem', active: false },
	{ name: '状态', ref: '/status', active: false },
	{ name: '比赛', ref: '/contest', active: false },
	{ name: '排名', ref: '/ranklist', active: false }
            ];

var problems = [ 
    { styl: 'success', stat: 'Y', id: '1', name: 'a + b Problem', all: 1000, ac: 1000, rat: '100%' },
];

var perPage = 40;

function getProblems(pageId) {
}

router.get('/', function(req, res) {
    getProblems(1);
    res.render('problem', { title: '问题 - CodeBursts', nav: nav, problems: problems });
});

router.get('/:pageId', function(req, res) {
    getProblems(req.params.pageId);
    res.render('problem', { title: '问题 - CodeBursts', nav: nav, problems: problems });
});

module.exports = router;

