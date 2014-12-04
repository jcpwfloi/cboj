var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var mongodb = new mongo.Db('cboj', server, {safe: true});

function fetchProblem(id, callback) {
    mongodb.open(function(err, db) {
        if (err || !db) callback(err, null);
        db.collection('problem', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err, null);
            }
            collection.findOne({id: id}, function(err, doc) {
                if (err) {
                    mongodb.close();
                    return callback(err, null);
                }
                mongodb.close();
                return callback(err, doc);
            });
        });
    });
}

function updateProblem(problemId, newProblem, callback) {
    mongodb.open(function(err, db) {
        if (err || !db) {
            callback();
            return;
        }
        db.collection('problem', function(err, collection) {
            if (err) {
                mongodb.close();
                callback();
                return;
            }
            collection.update({id: problemId}, {$set: newProblem}, function(err, doc) {
                mongodb.close();
                callback();
                return;
            });
        });
    });
}

exports.fetchProblem = fetchProblem;
exports.updateProblem = updateProblem;

