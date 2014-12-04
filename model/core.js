var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var mongodb = new mongo.Db('cboj', server, {safe: true});

function querySubmissionNum(callback) {
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
                if (doc && doc.value)
                    callback(err, doc.value);
                else callback(err, null);
            });
        });
    });
}

var parCnt;

function par(callback) {
    ++ parCnt;
    if (parCnt == 2) {
        callback();
        parCnt = 0;
    }
}

function addSubmission(submission, callback) {
    parCnt = 0;
    mongodb.open(function(err, db) {
        if (err || !db) return;
        db.collection('submissions', function(err, collection) {
            if (err) {
                mongodb.close();
                par(callback);
                return;
            }
            collection.insert(submission, function(err, doc) {
                mongodb.close();
                par(callback);
            });
        });
        db.collection('core', function(err, collection) {
            if (err) {
                mongodb.close();
                par(callback);
                return;
            }
            collection.update({name: 'submissionTotal'}, {$inc: {value: 1}}, function(err, doc) {
                mongodb.close();
                par(callback);
            });
        });
    })
}

exports.querySubmissionNum = querySubmissionNum;
exports.addSubmission = addSubmission;
