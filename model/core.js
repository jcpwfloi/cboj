var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var mongodb = new mongo.Db('cboj', server, {safe: true});

function querySubmissionNum(callback) {
    mongodb.open(function(err, db) {
        if (err) callback(err, null);
        db.collection('core', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err, null);
            }
            collection.findOne({name: 'submissionTotal'}, function(err, doc) {
                mongodb.close();
                if (doc && doc.value)
                    callback(err, doc.value);
                else return callback(err, null);
            });
        });
    });
}

exports.querySubmissionNum = querySubmissionNum;
