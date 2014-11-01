var monk = require('monk');
var db = monk('localhost:27017/OnlineJudge');

exports.auth = function(username, password) {
    if (username == 'jcpwfloi') return true;
    return false;
}

