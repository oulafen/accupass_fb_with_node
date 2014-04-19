//var mongodb = require('./db');
var mongoose = require('mongoose-q')(require('mongoose'));
mongoose.connect('mongodb://localhost/accupass_fb_with_node');
var Activity = require('./activity');
var SignUp = require('./sign_up');
var Bid = require('./bid');
var _ = require('underscore');
var Promise = require('promise');


var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    forgot_password_question: String,
    forgot_password_answer: String,
    login_type: String
}, {
    collection: 'users'
});

var userModel = mongoose.model('User', userSchema);

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.forgot_password_question = user.forgot_password_question;
    this.forgot_password_answer = user.forgot_password_answer;
    this.login_type = 'user';
}

User.prototype.save = function (callback) {
    var newUser = new userModel(this);
    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.update = function (user, callback) {
    userModel.update({_id: user._id}, {$set: { password: user.password }}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.get = function (name, callback) {
    userModel.findOne({name: name}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.find_all_users = function (login_type, callback) {
    userModel.find({login_type: login_type}, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
};

User.judge_register_input = function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_confirmation = req.body.password_confirmation,
        forgot_password_question = req.body.forgot_password_question,
        forgot_password_answer = req.body.forgot_password_answer;
    if (!name || !password || !password_confirmation || !forgot_password_answer || !forgot_password_question) {
        req.flash('error', '输入不能为空!');
        return res.redirect('user_register');
    }
    if (password_confirmation != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect("user_register");
    }
    return 'legal';
};

User.judge_login_input = function (req, res) {
    var name = req.body.name,
        password = req.body.password;
    if (!name || !password) {
        req.flash('error', '输入不能为空!');
        return res.redirect('/');
    }
    return 'legal';
};

User.judge_change_password_input = function (req, res) {
    var password = req.body.password,
        password_confirmation = req.body.password_confirmation;
    if (!password || !password_confirmation) {
        req.flash('error', '输入不能为空!');
        return res.redirect('/change_password');
    }
    if (password != password_confirmation) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/change_password');
    }
    return 'legal';
};

User.judge_add_user_input = function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_confirmation = req.body.password_confirmation,
        forgot_password_question = req.body.forgot_password_question,
        forgot_password_answer = req.body.forgot_password_answer;
    if (!name || !password || !password_confirmation || !forgot_password_answer || !forgot_password_question) {
        req.flash('error', '输入不能为空!');
        return res.redirect('/add_user');
    }
    if (password_confirmation != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect("/add_user");
    }
    return 'legal';
};

User.judge_reset_password_input = function (req, res) {
    if (!req.body.password || !req.body.password_confirmation) {
        req.flash('error', '输入不能为空！');
        return res.redirect('/forgot_3');
    }
    if (req.body.password != req.body.password_confirmation) {
        req.flash('error', '两次密码输入不同');
        return res.redirect('/forgot_3');
    }
};

User.delete_user = function (user, callback) {
    userModel.remove({_id: user._id}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.reconstruct_user_infos = function (req, res) {
    var user = req.session.user;
    return new Promise(function (resolve) {
        Activity.get(user.name, function (err, activity) {
            if (activity) {
                var promises = [];
                var activities = activity.activities;
                activities.forEach(function (activity) {
                    var user_info = {};
                    user_info.activity_name = activity.name;
                    var promise = new Promise(function (resolve) {
                        SignUp.count_sign_ups_num(user.name, activity.name)
                            .then(function (sign_ups_length) {
                                user_info.sign_ups_num = sign_ups_length;
                                return user_info;
                            })
                            .done(function (user_info) {
                                Bid.count_bids_num(user.name, activity.name)
                                    .then(function (bids_length) {
                                        user_info.bids_num = bids_length;
                                        resolve(user_info);
                                    });
                            })
                    });
                    promises.push(promise);
                });
                Promise.all(promises)
                    .then(function (user_infos) {
                        resolve(user_infos);
                    });
            }
        });
    })
};

module.exports = User;




