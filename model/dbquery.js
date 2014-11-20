var mongo = require('mongodb');
var server = new mongo.Server('127.0.0.1', 27017);
var mongodb = new mongo.Db('cboj', server, {safe: true});

function getUserByName(username, callback) {
    mongodb.open(function(err, db) {
        if (err) return callback(err, null);
        console.log('OK');
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err, null);
            }
            collection.findOne({name: username}, function(err, doc) {
                mongodb.close();
                if (doc) callback(err, doc);
                else callback(err, null);
            });
        });
    });
}

function updateUserByName(username, newuser, callback) {
    mongodb.open(function(err, db) {
        if (err) return callback(err, null);
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err, null);
            }
            collection.update({name: username}, {$set: newuser}, function(err, doc) {
            });
                mongodb.close();
                if (doc) callback(err, doc);
                else callback(err, null);
        });
    });
}

function removeUserByName(username, callback) {
    mongodb.open(function(err, db) {
        if (err) return callback(err, null);
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err, null);
            }
            collection.remove({name: username}, function(err, doc) {
                mongodb.close();
                if (err) callback(err, null);
                else callback(err, doc);
            });
        });
    });
}

function insertUser(newuser, callback) {
    mongodb.open(function(err, db) {
        if (err) return callback(err, null);
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err, null);
            }
            collection.insert(newuser, function(err, doc) {
                mongodb.close();
                if (err) callback(err, null);
                else callback(err, doc);
            });
        });
    });
}

exports.getUserByName = getUserByName;
exports.updateUserByName = updateUserByName;
exports.removeUserByName = removeUserByName;
exports.insertUser = insertUser;

