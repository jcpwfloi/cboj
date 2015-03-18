var mongo = require('mongodb').MongoClient;

function getstats(page, callback) {
mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        if (err) return;
        collection.find({}, {sort: {submissionId: -1}, limit: 50, skip: (page - 1) * 50}, function(err, doc) {
            if (err) return;
            doc.toArray(function(err, arr) {
                callback(arr);
            });
        });
    });
});
}

function getprob(problemId, callback) {
mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        if (err) return;
        collection.find({problemId: problemId, "status": 0}, {sort: {submissionId: -1}, limit: 50}, function(err, doc) {
            if (err) return;
            doc.toArray(function(err, arr) {
                callback(arr);
            });
});
    });
});
}

function getProbByUser(userId, callback) {
mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        if (err) return;
        collection.find({user: userId}, {sort: {submissionId: -1}, limit: 50}, function(err, doc) {
            if (err) return;
            doc.toArray(function(err, arr) {
                callback(arr);
            });
});
    });
});
}

exports.getstats = getstats;
exports.getprob = getprob;
exports.getProbByUser = getProbByUser;

