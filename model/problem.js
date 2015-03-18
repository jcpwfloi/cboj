var mongo = require('mongodb').MongoClient;

function fetchProblems(from, num, callback) {
    from += 1000;
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('problems', function(err, collection) {
            if (err) {
                callback(err, null);
                return;
            }
            collection.find({id: {$gte: from, $lt: from + num}, inprivate: {$ne: 1}}, {sort: {id: 1}}, function(err, doc) {
                
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
    });
}

function updateProblems(problemId, newProblem, callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('problems', function(err, collection) {
            if (err) {
                callback();
                return;
            }
            collection.update({id: problemId}, {$set: newProblem}, function(err, doc) {
                
                callback();
            });
        });
    });
}

exports.fetchProblems = fetchProblems;
exports.updateProblems = updateProblems;

