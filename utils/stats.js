var mongo = require('mongodb').MongoClient;

function setresult(id, ac, all) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('problem', function(err, collection) {
            collection.update({id: id}, {$set: {ac: ac, all: all}}, function(err, doc) {});
        });
        db.collection('problems', function(err, collection) {
            collection.update({id: id}, {$set: {ac: ac, all: all}}, function(err, doc) {});
        });
    });
}

function addall(id) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('problem', function(err, collection) {
            collection.update({id: id}, {$inc: {all: 1}}, function(err, doc) {});
        });
        db.collection('problems', function(err, collection) {
            collection.update({id: id}, {$inc: {all: 1}}, function(err, doc) {});
        });
    });
}

function addac(id) {
    mongo.connect('mongodb://localhost/cboj', function(err, db) {
        db.collection('problem', function(err, collection) {
            collection.update({id: id}, {$inc: {ac: 1}}, function(err, doc) {});
        });
        db.collection('problems', function(err, collection) {
            collection.update({id: id}, {$inc: {ac: 1}}, function(err, doc) {});
        });
    });
}

function execu() {
mongo.connect('mongodb://localhost/cboj', function(err, db) {
    db.collection('submissions', function(err, collection) {
        collection.find({processed: {$ne: true}}, function(err, doc) {
            doc.toArray(function(err, doc1) {
                for (var i = 0; i < doc1.length; ++ i) {
                    console.log(i);
                    console.log(doc1[i].status);
                    if (doc1[i].status != undefined) {
                        if (Number(doc1[i].status) == 0) addac(Number(doc1[i].problemId));
                        addall(Number(doc1[i].problemId));
                        collection.update({submissionId: doc1[i].submissionId}, {$set: {processed: true}}, function(err, doc) {});
                    }
                }
            });
        });
    });
});
}

exports.exec = execu;

