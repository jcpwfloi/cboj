var mongo = require('mongodb').MongoClient;

function querySubmissionNum(callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
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
    });
}

var parCnt;

function par(callback, db) {
    ++ parCnt;
    if (parCnt == 2) {
        
        callback();
        parCnt = 0;
    }
}

function addSubmission(submission, callback) {
    parCnt = 0;
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('submissions', function(err, collection) {
            if (err) {
                par(callback, db);
                return;
            }
            collection.insert(submission, function(err, doc) {
                par(callback, db);
            });
        });
        db.collection('core', function(err, collection) {
            if (err) {
                par(callback, db);
                return;
            }
            collection.update({name: 'submissionTotal'}, {$inc: {value: 1}}, function(err, doc) {
                par(callback, db);
            });
        });
    });
}

exports.querySubmissionNum = querySubmissionNum;
exports.addSubmission = addSubmission;

