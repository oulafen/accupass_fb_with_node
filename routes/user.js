var User = require('../models/user');
var Activity = require('../models/activity');
var Bid = require('../models/bid');
var BidPeople = require('../models/bid_people');
var SignUp = require('../models/sign_up');
var crypto = require('crypto');


exports.register = function (req, res) {
    res.render("user_register", {
        error: req.flash('error').toString()
    });
};

exports.user_index = function (req, res) {
    res.render("user_index", {
        user: req.session.user
    });
};

exports.forgot_1 = function (req, res) {
    res.render("forgot_1", {
        error: req.flash('error').toString()
    });
};

exports.forgot_2 = function (req, res) {
    res.render("forgot_2", {
        error: req.flash('error').toString(),
        forgot_password_question: req.session.user_of_forgot_password.forgot_password_question
    });
};

exports.forgot_3 = function (req, res) {
    res.render("forgot_3", {
        error: req.flash('error').toString()
    });
};

exports.create_login_session = function (req, res) {
    var is_legal = User.judge_login_input(req, res);
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    if (is_legal == 'legal') {
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '该用户不存在!');
                return res.redirect('/');
            }
            if (user.password != password) {
                req.flash('error', '输入密码不正确!');
                return res.redirect('/');
            }
            req.session.user = user;
            if (user.login_type == 'user') {
                res.redirect('/user_index');
            }
            if (user.login_type == 'admin') {
                User.find_all_users('user', function (err, users) {
                    if (users) {
                        req.session.users = users;
                        res.redirect('/admin_index');
                    }
                });
            }
        });
    }
};

exports.process_register_info = function (req, res) {
    var is_legal = User.judge_register_input(req, res);
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var user = req.body;
    user.password = password;

    if (is_legal == 'legal') {
        var newUser = new User(user);
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/user_register');
            }
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/user_register');
                }
                req.session.user = user;
                res.redirect('/user_index');
            });
        });
    }
};

exports.forgot_pw_1 = function (req, res) {
    if (!req.body.name) {
        req.flash('error', "账户不能为空！");
        return res.redirect('/forgot_1');
    }
    User.get(req.body.name, function (err, user) {
        if (!user) {
            req.flash('error', '该用户不存在!');
            return res.redirect('/forgot_1');
        }
        req.session.user_of_forgot_password = user;
        res.redirect('/forgot_2');
    })
};

exports.judge_answer = function (req, res) {
    if (!req.body.forgot_password_answer) {
        req.flash('error', '输入不能为空！');
        return res.redirect('/forgot_2');
    }
    if (req.session.user_of_forgot_password.name != req.body.forgot_password_answer) {
        req.flash('error', '忘记密码答案错误');
        return res.redirect('/forgot_2');
    }
    res.redirect('/forgot_3');
};

exports.reset_password = function (req, res) {
    User.judge_reset_password_input(req,res);
    var user = req.session.user_of_forgot_password;
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(user.name, function (err, user) {
        if (user) {
            user.password = password;
            User.update(user, function (err, u) {
                if (u) {
                    req.session.user = user;
                    res.redirect('/user_index');
                }
            })
        }
    })
};

exports.process_phone_login = function (req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name, function (err, user) {
        if (user && user.password == password) {
            res.write('true');
            res.end();
        } else {
            res.write('false');
            res.end();
        }
    });
};

exports.process_phone_data = function (req, res) {
    var newActivity = new Activity(req.body.login_user, req.body.activities);
    var newBid = new Bid(req.body.login_user, req.body.bids);
    var newBidPeople = new BidPeople(req.body.login_user, req.body.bid_people);
    var newSignUp = new SignUp(req.body.login_user, req.body.sign_ups);
    newActivity.update(function(err,activity){});
    newBid.update(function(err,activity){});
    newBidPeople.update(function(err,activity){});
    newSignUp.update(function(err,activity){});

    res.write('true');
    res.end();
};

