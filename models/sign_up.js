//var mongodb = require('./db');
var mongoose = require('mongoose-q')(require('mongoose'));
var _ = require('underscore');
var Promise = require('promise');

var signUpSchema = new mongoose.Schema({
    user: String,
    sign_ups: Array
}, {
    collection: 'sign_ups'
});

var signUpModel = mongoose.model('SignUp', signUpSchema);

function SignUp(user, sign_ups) {
    this.user = user;
    this.sign_ups = sign_ups;
}

SignUp.prototype.update = function (callback) {
    var sign_up = new signUpModel(this);
    signUpModel.remove({user: this.user}, function (err, sign_up) {
        return callback(null, sign_up);
    });
    sign_up.save(sign_up);
};

SignUp.count_sign_ups_num = function (user_name, activity_name) {
    return new Promise(function (resolve) {
        signUpModel.find({user: user_name}).execQ()
            .then(function (sign_up) {
                var sign_ups = _.filter(sign_up[0].sign_ups, function (sign_up) {
                    return sign_up.activity_name == activity_name
                });
                return  sign_ups.length;
            })
            .done(function (sign_ups_length) {
                resolve(sign_ups_length)
            });
    });
};

SignUp.get_sign_up_list = function(user_name,activity_name){
    return new Promise(function(resolve){
        signUpModel.find({user: user_name}).execQ()
            .then(function(sign_up){
                return _.filter(sign_up[0].sign_ups, function (sign_up) {
                    return sign_up.activity_name == activity_name
                });
            })
            .done(function(sign_ups){
                resolve(sign_ups);
            })
    })
};

module.exports = SignUp;

