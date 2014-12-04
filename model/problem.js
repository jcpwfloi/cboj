var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var db = new mongo.Db('cboj', server, {safe: true});

db.open(function(err, db) {});

function fetchProblems(from, num, callback) {
    from += 1000;
        db.collection('problems', function(err, collection) {
            if (err) {
                callback(err, null);
                return;
            }
            collection.find({id: {$gte: from, $lt: from + num}}, function(err, doc) {
                if (err) {
                    callback(err, null);
                    return;
                }
                doc.toArray(function(err, arr) {
                    if (err) callback(err, null);
                    callback(err, arr);
                });
            });
        });
}

function updateProblems(problemId, newProblem, callback) {
        db.collection('problems', function(err, collection) {
            if (err) {
                callback();
                return;
            }
            collection.update({id: problemId}, {$set: newProblem}, function(err, doc) {
                callback();
            });
        });
}

exports.fetchProblems = fetchProblems;
exports.updateProblems = updateProblems;

