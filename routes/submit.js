var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.end();
});

router.get('/:problemId', function(req, res) {
    var problemId = req.params.problemId;
    res.send(problemId);
    res.end();
});

module.exports = router;
