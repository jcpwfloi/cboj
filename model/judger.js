var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var db = new mongo.Db('cboj', server, {safe: true});
var Step = require('step');
var fs = require('fs');
var cp = require('child_process');
var problemId, filelist = [], child, timer, flag, id, result = [];

db.open(function(err, db) {});

function endtle() {
    db.collection('submissions', function(err, collection) {
        if (err) return;
        collection.update({submissionId: id}, {$set: {status: 2}}, function(err, doc) {
        });
    });
    db.collection('core', function(err, collection) {
        if (err) return;
        collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
            doJudge();
        });
    });
}

function endce() {
    db.collection('submissions', function(err, collection) {
        if (err) return;
        collection.update({submissionId: id}, {$set: {status: 4}}, function(err, doc) {
        });
    });
    db.collection('core', function(err, collection) {
        if (err) return;
        collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
            doJudge();
        });
    });
}

function getCompletedTotal(callback) {
        db.collection('core', function(err, collection) {
            if (err) {
                callback(err, null);
                return;
            }
            collection.findOne({name: 'completedTotal'}, function(err, doc) {
                if (doc) callback(err, doc);
                else callback(err, null);
            });
        });
}

function getSubmissionTotal(callback) {
        db.collection('core', function(err, collection) {
            if (err) {
                callback(err, null);
                return;
            }
            collection.findOne({name: 'submissionTotal'}, function(err, doc) {
                if (doc) callback(err, doc);
                else callback(err, null);
            });
        });
}

function getSubmission(submissionId, callback) {
        db.collection('submissions', function(err, collection) {
            if (err) {
                callback(err, null);
                return;
            }
            collection.findOne({submissionId: submissionId}, function(err, doc) {
                if (doc) callback(err, doc);
                else callback(err, null);
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
        function(err1, doc1, doc2) {
            if (doc1.value >= doc2.value) endProgram();
            else {
                id = doc1.value + 1;
                getSubmission(id, this);
            }
        },
        function(err, doc) {
            var shit = this;
            problemId = doc.problemId;
            flag = true;
            if (doc.language == 0) { //cpp
                var pathname = __dirname + '/../../judger/code.cpp';
                var execpath = __dirname + '/../../judger/code.exe';
Step(
    function() {
        fs.writeFile(pathname, doc.code, this);
    },
    function() {
        cp.exec('g++ -o ' + execpath + ' ' + pathname + ' -DONLINE_JUDGE -lm', this)
    },
    function(err, stdout, stderr) {
        console.log(err, stdout, stderr);
        if (err) {
            endce();
        } else shit();
    }
);
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
    function(err, stdout, stderr) {
        if (err) {
            endce();
        } else shit();
    }
);
            } else {
            }
        },
        function() {
            var datapath = __dirname + '/../../judger/data/' + String(problemId) + '/';
            var files = fs.readdirSync(datapath);
            var regin = /\.in/, regout = /\.out/;
            for (var i = 0; i < files.length; ++ i) {
                var name = files[i];
                if (regin.test(name)) {
                    name = name.replace(regin, '');
                    if (files.indexOf(name + '.out') != -1) filelist.push(name);
                }
            }
            this();
        },
        function() {
            var execpath = __dirname + '/../../judger/code.exe';
            var outpath = __dirname + '/../../judger/tempout';
            var datapath = __dirname + '/../../judger/data/' + String(problemId) + '/';
            function run(i) {
                if (i >= filelist.length) return;
                Step(
                    function() {
                        var inputpath = datapath + filelist[i] + '.in';
                        var anspath = datapath + filelist[i] + '.out';
                        child = cp.exec(execpath + ' < ' + inputpath + ' > ' + outpath, {timeout: 1000}, this);
                    },
                    function(err, stdout, stderr) {
                        //console.log(err, stdout, stderr);
                        if (err && err.killed && err.signal == 'SIGTERM') {
                            console.log('tle');
                            endtle();
                            return;
                        } else {
                            console.log('not tle');
                            this();
                        }
                    }, function() {
                    }
                );
            }
            run(0);
        }
    );
}

exports.doJudge = doJudge;

