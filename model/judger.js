var mongo = require('mongodb').MongoClient;
var Step = require('step');
var fs = require('fs');
var cp = require('child_process');
var problemId, filelist = [], child, timer, flag, id, result = [], score, startTime, endTime;

function endwa(callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 1}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    
                    callback();
                });
            });
        });
    });
    });
}

function endre(callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 3}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    
                    callback();
                });
            });
        });
    });
    });
}

function endtle(callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 2}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    
                    callback();
                });
            });
        });
    });
    });
}

function endce(callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 4}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    
                    callback();
                });
            });
        });
    });
    });
}

function endac(callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {status: 0}}, function(err, doc) {
            db.collection('core', function(err, collection) {
                collection.update({name: 'completedTotal'}, {$inc: {value: 1}}, function(err, doc) {
                    
                    callback();
                });
            });
        });
    });
    });
}

function getCompletedTotal(callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
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
    });
}

function getSubmissionTotal(callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
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
    });
}

function getSubmission(submissionId, callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
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
                //getSubmission(id, this);
                var shit = this;
                getSubmission(id, function(err, doc) {
                    mongo.connect('mongodb://localhost/cboj', function(err3, db) {
                        db.collection('submissions', function(err2, collection) {
                            collection.update({submissionId: id}, {$set: {status: 5}}, function(err1, res) {
                                shit(err, doc);
                            });
                        });
                    });
                });
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
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('submissions', function(err, collection) {
            collection.update({submissionId: id}, {$set: {compilerMessage: stderr}}, function(err, doc) {
                
                if (werr) {
                    endce(function() {
                        doJudge();
                    });
                } else shit();
            });
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
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('submissions', function(err, collection) {
            collection.update({submissionId: id}, {$set: {compilerMessage: stdout}}, function(err, doc) {
                
                if (werr) {
                    endce(function() {
                        doJudge();
                    });
                } else shit();
            });
        });
    });
    }
);
            } else if (doc.language == 2) {
                var execpath = __dirname + '/../../judger/code.exe';
Step(
    function() {
        doc.code = '#!/usr/bin/python\n' + doc.code;
        fs.writeFile(execpath, doc.code, this);
    }, function() {
        cp.exec('chmod +x ' + execpath, this);
    }, function(err, stdout, stderr) {
        shit();
    }
);
            } else if (doc.language == 4) {
                var execpath = __dirname + '/../../judger/code.exe';
Step(
    function() {
        doc.code = '#!/usr/local/bin/node\n' + doc.code;
        fs.writeFile(execpath, doc.code, this);
    }, function() {
        cp.exec('chmod +x ' + execpath, this);
    }, function(err, stdout, stderr) {
        shit();
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
            result = [];
            var shit = this;
            startTime = new Date().getTime();
            function run(i) {
                if (i >= filelist.length) {
                    shit();
                    return;
                } else {
                    var inputpath = datapath + filelist[i] + '.in';
                    var anspath = datapath + filelist[i] + '.out';
                    Step(
                        function() {
                            child = cp.exec(execpath + ' < ' + inputpath + ' > ' + outpath, {timeout: 1000, maxBuffer: 200*1024*1024, killSignal: 'SIGKILL'}, this);
                        },
                        function(err, stdout, stderr) {
                            if (err && err.killed && err.signal == 'SIGKILL') {
                                cp.exec('killall code.exe', function() {
                                    result.push(2);
                                    run(i + 1);});
                                return;
                            } else if (err && !err.killed && err.signal != 'SIGKILL') {
                                result.push(3);
                                run(i + 1);
                                return;
                            } else {
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
            endTime = new Date().getTime();
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
mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        collection.update({submissionId: id}, {$set: {result: result, score: score, usedTime: endTime - startTime}}, function(err, doc) {
            
            callback();
        });
    });
});
}

exports.doJudge = doJudge;
exports.getSubmission = getSubmission;

