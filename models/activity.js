var mongodb = require('./db');

function Activity(user,activities) {
    this.user = user;
    this.activities = activities;
}

module.exports = Activity;

Activity.prototype.update = function(callback){
    var activity = this;
    mongodb.open(function (err, db) {
        db.collection('activities', function (err, collection) {
            collection.remove({user:activity.user},function(err,activity){
                return callback(null,activity);
            });
            collection.insert(activity,{
                safe: true
            },function(err,activity){
                mongodb.close();
                return callback(null,activity);
            })
        });
    });
};

