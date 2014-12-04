var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var db = new mongo.Db('cboj', server, {safe: true});

db.open(function(err, db) {});

function fetchProblem(id, callback) {
        db.collection('problem', function(err, collection) {
            if (err) {
                callback(err, null);
                return;
            }
            collection.findOne({id: id}, function(err, doc) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(err, doc);
            });
        });
}

function updateProblem(problemId, newProblem, callback) {
        db.collection('problem', function(err, collection) {
            if (err) {
                callback();
                return;
            }
            collection.update({id: problemId}, {$set: newProblem}, function(err, doc) {
                callback();
            });
        });
}

exports.fetchProblem = fetchProblem;
exports.updateProblem = updateProblem;

