var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var db = new mongo.Db('cboj', server, {safe: true});
var Step = require('step');
var fs = require('fs');
var cp = require('child_process');
var problemId, filelist = [], child, timer, flag, id, result = [], score;

db.open(function(err, db) {});

function endwa(callback) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 1}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    callback();
                });
            });
        });
    });
}

function endre(callback) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 3}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    callback();
                });
            });
        });
    });
}

function endtle(callback) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 2}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    callback();
                });
            });
        });
    });
}

function endce(callback) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 4}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    callback();
                });
            });
        });
    });
}

function endac(callback) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 0}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    callback();
                });
            });
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
    cp.exec('rm -f ' + __dirname + '/../../judger/judge.lock ' + __dirname + '/../../judger/code.exe ' + __dirname + '/../../judger/code.cpp ' + __dirname + '/../../judger/code.pas', function(err, stdout, stderr) {
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
        var werr = err;
        db.collection('submissions', function(err, collection) {
            collection.update({submissionId: id}, {$set: {compilerMessage: stderr}}, function(err, doc) {
                if (werr) {
                    endce(function() {
                        doJudge();
                    });
                } else shit();
            });
        });
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
        var werr = err;
        db.collection('submissions', function(err, collection) {
            collection.update({submissionId: id}, {$set: {compilerMessage: stdout}}, function(err, doc) {
                if (werr) {
                    endce(function() {
                        doJudge();
                    });
                } else shit();
            });
        });
    }
);
            } else {
                endce(function() {
                    doJudge();
                });
            }
        },
        function() {
            var datapath = __dirname + '/../../judger/data/' + String(problemId) + '/';
            var files = fs.readdirSync(datapath);
            var regin = /\.in/, regout = /\.out/;
            filelist = [];
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
            console.log(filelist, filelist.length);
            result = [];
            var shit = this;
            function run(i) {
                console.log('run', i);
                if (i >= filelist.length) {
                    shit();
                    return;
                } else {
                    var inputpath = datapath + filelist[i] + '.in';
                    var anspath = datapath + filelist[i] + '.out';
                    Step(
                        function() {
                            child = cp.exec(execpath + ' < ' + inputpath + ' > ' + outpath, {timeout: 1000}, this);
                        },
                        function(err, stdout, stderr) {
                            console.log(err, stdout, stderr);
                            if (err && err.killed && err.signal == 'SIGTERM') {
                                console.log('tle');
                                result.push(2);
                                run(i + 1);
                                return;
                            } else if (err && !err.killed && err.signal != 'SIGTERM') {
                                console.log('re');
                                result.push(3);
                                run(i + 1);
                                return;
                            } else {
                                console.log('not tle');
                                this();
                            }
                        }, function() {
                            cp.exec('diff -w -B -q ' + outpath + ' ' + anspath, this);
                        }, function(err, stdout, stderr) {
                            if (!err) {
                                result.push(0);
                                run(i + 1);
                                return;
                            } else {
                                result.push(1);
                                run(i + 1);
                                return;
                            }
                        }
                    );
                }
            }
            run(0);
        },
        function() {
            var shit = this;
            var correctNum = 0;
            for (var i = 0; i < result.length; ++ i) {
                if (!result[i]) ++ correctNum;
            }
            if (result.length) score = Math.round(correctNum * 100 / result.length);
            else score = 0;
            if (score == 100) endac(shit);
            else {
                var tempnum = 0;
                for (var i = 0; i < result.length; ++ i)
                    if (result[i]) {
                        tempnum = result[i];
                        break;
                    }
                if (tempnum == 1) {
                    endwa(shit);
                } else if (tempnum == 2) {
                    endtle(shit);
                } else if (tempnum == 3) {
                    endre(shit);
                } else {
                    endwa(shit);
                }
            }
        },
        function() {
            giveResult(result, score, this);
        },
        function() {
            doJudge();
        }
    );
}

function giveResult(result, score, callback) {
    console.log(result, score);
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {result: result, score: score}}, function(err, doc) {
            callback();
        });
    });
}

exports.doJudge = doJudge;
exports.getSubmission = getSubmission;

