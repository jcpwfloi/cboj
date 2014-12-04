var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var db = new mongo.Db('cboj', server, {safe: true});

db.open(function(err, db) {});

function querySubmissionNum(callback) {
        db.collection('core', function(err, collection) {
            if (err) {
                callback(err, null);
                return;
            }
            collection.findOne({name: 'submissionTotal'}, function(err, doc) {
                if (doc && doc.value)
                    callback(err, doc.value);
                else callback(err, null);
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
        db.collection('submissions', function(err, collection) {
            if (err) {
                par(callback);
                return;
            }
            collection.insert(submission, function(err, doc) {
                par(callback);
            });
        });
        db.collection('core', function(err, collection) {
            if (err) {
                par(callback);
                return;
            }
            collection.update({name: 'submissionTotal'}, {$inc: {value: 1}}, function(err, doc) {
                par(callback);
            });
        });
}

exports.querySubmissionNum = querySubmissionNum;
exports.addSubmission = addSubmission;

