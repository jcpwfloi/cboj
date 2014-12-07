var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var db = new mongo.Db('cboj', server, {safe: true});
var Step = require('step');

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

function addProblem(newProblem, callback) {
    console.log(newProblem);
    Step(
        function() {
            db.collection('core', this)
        },
        function(err, collection) {
            collection.findOne({name: 'problemTotal'}, this);
        },
        function(err, doc) {
            newProblem.id = doc.value + 1;
            this();
        },
        function() {
            db.collection('core', this);
        },
        function(err, collection) {
            collection.update({name: 'problemTotal'}, {$inc: {value: 1}}, this);
        },
        function(err, doc) {
            this();
        },
        function() {
            db.collection('problem', this);
        },
        function(err, collection) {
            collection.insert(newProblem, this);
        },
        function(err, doc) {
            db.collection('problems', this);
        },
        function(err, collection) {
            var problems = {
                id: newProblem.id,
                name: newProblem.name,
                ac: 0,
                all: 0
            };
            collection.insert(problems, this);
        },
        function(err, doc) {
            callback();
        }
    );
}

exports.fetchProblem = fetchProblem;
exports.updateProblem = updateProblem;
exports.addProblem = addProblem;

