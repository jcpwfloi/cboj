var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var mongodb = new mongo.Db('cboj', server, {safe: true});

function fetchProblems(from, num, callback) {
    from += 1000;
    mongodb.open(function(err, db) {
        if (err) callback(err, null);
        db.collection('problems', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err, null);
            }
            collection.find({id: {$gte: from, $lt: from + num}}, function(err, doc) {
                if (err) {
                    mongodb.close();
                    return callback(err, null);
                }
                doc.toArray(function(err, arr) {
                    mongodb.close();
                    if (err) callback(err, null);
                    callback(err, arr);
                });
            });
        });
    });
}

exports.fetchProblems = fetchProblems;
