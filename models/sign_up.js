var mongodb = require('./db');

function SignUp(user,sign_ups) {
    this.user = user;
    this.sign_ups = sign_ups;
}

module.exports = SignUp;

SignUp.prototype.update = function(callback){
    var sign_up = this;
    mongodb.open(function (err, db) {
        db.collection('sign_ups', function (err, collection) {
            collection.remove({user:sign_up.user},function(err,sign_up){
                return callback(null,sign_up);
            });
            collection.insert(sign_up,{safe: true},function(err,sign_up){
                mongodb.close();
                return callback(null,sign_up);
            })
        });
    });
};

