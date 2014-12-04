var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var mongodb = new mongo.Db('cboj', server, {safe: true});
var Step = require('step');
var fs = require('fs');
var cp = require('child_process');
var problemId;

function getCompletedTotal(callback) {
    mongodb.open(function(err, db) {
        if (err || !db) {
            callback(err, null);
            return;
        }
        db.collection('core', function(err, collection) {
            if (err) {
                mongodb.close();
                callback(err, null);
                return;
            }
            collection.findOne({name: 'completedTotal'}, function(err, doc) {
                mongodb.close();
                if (doc) callback(err, doc);
                else callback(err, null);
            });
        });
    });
}

function getSubmissionTotal(callback) {
    mongodb.open(function(err, db) {
        if (err || !db) {
            callback(err, null);
            return;
        }
        db.collection('core', function(err, collection) {
            if (err) {
                mongodb.close();
                callback(err, null);
                return;
            }
            collection.findOne({name: 'submissionTotal'}, function(err, doc) {
                mongodb.close();
                if (doc) callback(err, doc);
                else callback(err, null);
            });
        });
    });
}

function getSubmission(submissionId, callback) {
    mongodb.open(function(err, db) {
        if (err || !db) {
            callback(err, null);
            return;
        }
        db.collection('submissions', function(err, collection) {
            if (err) {
                mongodb.close();
                callback(err, null);
                return;
            }
            collection.findOne({submissionId: submissionId}, function(err, doc) {
                mongodb.close();
                if (doc) callback(err, doc);
                else callback(err, null);
            });
        });
    });
}

function endProgram() {
    cp.exec('rm -f ' + __dirname + '/../../judger/judge.lock', function(err, stdout, stderr) {
    });
}

function doJudge() {
    Step(
        function() {
            cp.exec('touch ' + __dirname + '/../../judger/judge.lock', this);
        },
        function(err, stdout, stderr) {
            getCompletedTotal(this.parallel());
            getSubmissionTotal(this.parallel());
        },
        function(err1, doc1, err2, doc2) {
            console.log(err1, doc1, err2, doc2);
            if (doc1.value >= doc2.value) endProgram();
            else {
                var id = doc1.value + 1;
                getSubmission(id, this);
            }
        },
        function(err, doc) {
            problemId = doc.problemId;
            if (doc.language == 0) { //cpp
                var pathname = __dirname + '/../../judger/code.cpp';
                var execpath = __dirname + '/../../judger/code.exe';
Step(
    function() {
        fs.writeFile(pathname, doc.code, this);
    },
    function() {
        cp.exec('g++ -o ' + execpath + ' ' + pathname + ' -DONLINE_JUDGE -lm', this),
    function() {
    }
    }
);
                this();
            } else if (doc.language == 1) { //pas
                var pathname = __dirname + '/../../judger/code.pas';
                var execpath = __dirname + '/../../judger/code.exe';
Step(
    function() {
        fs.writeFile(pathname, doc.code, this);
    },
    function() {
        cp.exec('fpc -o' + execpath + ' ' + pathname, this);
    },
    function() {
    }
);
            } else {
            }
            this();
        },
        function() {
            var execpath = __dirname + '/../../judger/code.exe';
            var datapath = __dirname + '/../../judger/data/' + String(problemId) + '/';
        }
    );
}

exports.doJudge = doJudge;

