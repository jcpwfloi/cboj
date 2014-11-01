var monk = require('monk');
var db = monk('localhost:27017/OnlineJudge');

exports.auth = function(username, callback) {
    var users = db.get('users');
    users.find({username: username}, function(err, docs) {
        callback(docs[0]);
    });
}

