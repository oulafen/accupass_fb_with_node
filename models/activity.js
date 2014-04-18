var mongodb = require('./db');

function Activity(activity) {
    this.user = activity.user;
    this.name = activity.name;
    this.status = activity.status;
}

module.exports = Activity;

Activity.prototype.save = function (callback) {
    var activity = {
        user:this.user,
        name:this.name,
        status: this.status
    };
    mongodb.open(function (err, db) {
        db.collection('activities', function (err, collection) {
            collection.insert(activity, {
                    safe: true
                }, function (err, activity) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, activity[0]);
                }
            );
        });
    });
};

Activity.get = function (name, callback) {
    mongodb.open(function (err, db) {
        db.collection('activities', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({name: name}, function (err, activity) {
                mongodb.close();
                callback(null, activity);
            });
        });
    });
};


