var express = require('express');
var router = express.Router();

var nav = [
	{ name: '首页', ref: '/', active: true },
	{ name: '问题', ref: '/problem', active: false },
	{ name: '状态', ref: '/status', active: false },
	{ name: '比赛', ref: '/contest', active: false },
	{ name: '排名', ref: '/ranklist', active: false }
            ];

var login;
var ranklist;

/* GET home page. */
router.get('/', function(req, res) {
    if (req.session.user)
        login = req.session.user;
    res.render('v2/index', 
    {
      title: '首页 - CodeBursts!',
      nav: nav,
      ranklist: ranklist,
      login: login
    });
});

module.exports = router;

