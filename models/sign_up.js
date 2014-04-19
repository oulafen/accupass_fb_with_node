//var mongodb = require('./db');
var mongoose = require('mongoose');
var _ = require('underscore');

var signUpSchema = new mongoose.Schema({
    user: String,
    sign_ups: Array
}, {
    collection: 'sign_ups'
});

var signUpModel = mongoose.model('SignUp', signUpSchema);

function SignUp(user,sign_ups) {
    this.user = user;
    this.sign_ups = sign_ups;
}

SignUp.prototype.update = function(){
    var sign_up = new signUpModel(this);
    signUpModel.remove({user:this.user});
    sign_up.save(sign_up);
};

SignUp.count_sign_ups_num = function(user_name,activity_name,callback){
    signUpModel.find(user_name,function(err,sign_up){
        var sign_ups = _.filter(sign_up.sign_ups,function(sign_up){
            return sign_up.activity_name == activity_name
        });
        return callback(sign_ups.length);
    })
};

module.exports = SignUp;

