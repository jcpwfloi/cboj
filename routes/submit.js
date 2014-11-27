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
    res.render('submit', { problemId: '', nav: nav });
});

router.get('/success', function(req, res) {
    res.send('Hello World');
    res.end();
});

router.post('/', function(req, res) {
    var problemId = req.param('problemId');
    var language = req.param('Language');
    var code = req.param('code');
    console.log(language);
    res.redirect(301, '/submit/success');
    res.end();
});

router.get('/:problemId', function(req, res) {
    var problemId = req.params.problemId;
    res.render('submit', { problemId: problemId, nav: nav });
});

module.exports = router;
