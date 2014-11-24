var problems = require('./problems');

problems.fetchProblem(1001, function(err, doc) {
    console.log(doc);
});
