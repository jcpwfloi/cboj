var mongo = require('mongodb').MongoClient;

function getUserByName(username, callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('users', function(err, collection) {
            if (err) {
                callback(err, null);
                
                return;
            }
            collection.findOne({name: username}, function(err, doc) {
                
                if (doc) callback(err, doc);
                else callback(err, null);
            });
        });
    });
}

function updateUserByName(username, newuser, callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('users', function(err, collection) {
            if (err) {
                callback(err, null);
                
                return;
            }
            collection.update({name: username}, {$set: newuser}, function(err, doc) {
            });
                
                if (doc) callback(err, doc);
                else callback(err, null);
        });
    });
}

function removeUserByName(username, callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('users', function(err, collection) {
            if (err) {
                callback(err, null);
                
                return;
            }
            collection.remove({name: username}, function(err, doc) {
                
                if (err) callback(err, null);
                else callback(err, doc);
            });
        });
    });
}

function insertUser(newuser, callback) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('users', function(err, collection) {
            if (err) {
                callback(err, null);
                
                return;
            }
            collection.insert(newuser, function(err, doc) {
                
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

