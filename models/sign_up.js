var mongodb = require('./db');

function SignUp(sign_up) {
    this.user = sign_up.user;
    this.activity_name = sign_up.activity_name;
    this.name = sign_up.name;
    this.phone = sign_up.phone;
}

module.exports = SignUp;

SignUp.prototype.save = function (callback) {
    var sign_up = {
        user: this.user,
        activity_name: this.activity_name,
        name: this.name,
        phone: this.phone
    };
    mongodb.open(function (err, db) {
        db.collection('sign_ups', function (err, collection) {
            collection.insert(sign_up, {
                    safe: true
                }, function (err, sign_up) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, sign_up[0]);
                }
            );
        });
    });
};

SignUp.get = function (user, activity_name, callback) {
    mongodb.open(function (err, db) {
        db.collection('sign_ups', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find({user: user, activity_name: activity_name}, function (err, sign_up) {
                mongodb.close();
                callback(null, sign_up);
            });
        });
    });
};


