//var mongodb = require('./db');
var mongoose = require('mongoose');

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

SignUp.prototype.update = function(callback){
    var sign_up = new signUpModel(this);
    signUpModel.remove({user:this.user},function(err,sign_up){
        callback(null,sign_up);
    });
    sign_up.save(sign_up,function(err,sign_up){
        callback(null,sign_up);
    });
};

module.exports = SignUp;

