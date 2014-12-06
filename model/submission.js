var mongo = require('mongodb'),
    server = new mongo.Server('127.0.0.1', 27017),
    db = new mongo.Db('cboj', server, {safe: true});

db.open(function(err, db) {});

function getstats(page, callback) {
    db.collection('submissions', function(err, collection) {
        if (err) return;
        collection.find({}, {sort: {submissionId: -1}, limit: 50}, function(err, doc) {
            if (err) return;
            doc.toArray(function(err, arr) {
                callback(arr);
            });
        });
    });
}

exports.getstats = getstats;
