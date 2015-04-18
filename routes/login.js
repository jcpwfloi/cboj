var express = require('express');
var JSON = require('JSON');
var router = express.Router();
var db = require('../model/dbquery');

var nav = [
    { name: '首页', ref: '/', active: true },
    { name: '问题', ref: '/problem', active: false },
    { name: '状态', ref: '/status', active: false },
    { name: '比赛', ref: '/contest', active: false },
    { name: '排名', ref: '/ranklist', active: false }
            ];

router.get('/', function(req, res) {
    res.render('login', { title: '登陆 - CodeBursts!', nav: nav });
});

router.get('/register', function(req, res) {
    res.render('login/register', { title: '注册 - CodeBursts!', nav: nav });
});

router.post('/register', function(req, res) {
    var username = req.param('user');
    var password = req.param('pass');
	if (!(/^[a-zA-Z0-9_]{3,16}$/.test(username))) {
		res.send({stat: 0});
		res.end();
	} else {
		db.getUserByName(username, function(err, docs) {
			if (err) throw err;
			if (docs) {
				res.send({stat: 0});
				res.end();
				return;
			} else {
				db.insertUser({name: username, pass: password}, function(err, doc) {
					if (err) throw err;
					res.send({stat: 1});
					res.end();
				});
			}
		});
	}
});

router.get('/register/success', function(req, res) {
    res.render('login/success', { title: '注册成功 - CodeBursts!', nav: nav });
});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('back');
});

router.post('/auth', function(req, res) {
    req.session.user = null;
    var password = req.param('password');
    var username = req.param('username');
    db.getUserByName(username, function(err, docs) {
        if (err) throw err;
        if (!docs) {
            res.send({stat: "failed"});
            res.end();
            return;
        }
        if (docs.pass == password) {
            req.session.user = {
                username: username,
                password: password,
                admin: docs.admin
            };
            res.send({stat: "success"});
            res.end();
        } else {
            res.send({stat: "failed"});
            res.end();
        }
    });
});

module.exports = router;

