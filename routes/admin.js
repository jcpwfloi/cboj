var express = require('express');
var router = express.Router();

var db = require('../model/dbquery');

var nav = [
    { name: '管理首页', ref: '/admin', active: true },
    { name: '管理用户', ref: '/admin/users', active: false },
    { name: '管理问题', ref: '/admin/problems', active: false },
    { name: '管理比赛', ref: '/admin/contests', active: false },
            ];

function checkAvail(req, res, callback) {
    if (!req.session.user) {
        res.render('login', { nav: nav });
        return;
    }
    var username = req.session.user.username;
    db.getUserByName(username, function(err, doc) {
        if (doc.admin == true) callback();
        else {
            res.render('login', { nav: nav });
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

module.exports = router;
