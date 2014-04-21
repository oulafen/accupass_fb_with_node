var User = require('../models/user');
var Activity = require('../models/activity');
var Bid = require('../models/bid');
var BidPeople = require('../models/bid_people');
var SignUp = require('../models/sign_up');
var BidResult = require('../models/bid_result');
var BidWinner = require('../models/bid_winner');
var crypto = require('crypto');
var url = require('url');
var querystring = require('querystring');


exports.register = function (req, res) {
    res.render("user_register", {
        error: req.flash('error').toString()
    });
};

exports.user_index = function (req, res) {
    User.reconstruct_user_infos(req, res)
        .then(function (user_infos) {
            var newBidWinner = new BidWinner(req.session.user.name, ['un_get']);
            newBidWinner.update(function (err, bid_winner) {});
            res.render("user_index", {
                user: req.session.user,
                user_infos: user_infos
            });
        })
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

exports.bid_list = function (req, res) {
    var get_info = querystring.parse(url.parse(req.url).query);
    Bid.reconstruct_bid_list_infos(req.session.user.name, get_info.activity_name)
        .then(function (bid_list_infos) {
            res.render("bid_list", {
                user: req.session.user,
                bid_list_infos: bid_list_infos,
                sign_ups_num: get_info.sign_ups_num,
                activity_name: get_info.activity_name
            });
        })
};

exports.sign_up_list = function (req, res) {
    var get_info = querystring.parse(url.parse(req.url).query);
    SignUp.get_sign_up_list(req.session.user.name,get_info.activity_name)
        .then(function(sign_ups){
            res.render("sign_up_list", {
                user: req.session.user,
                sign_ups: sign_ups,
                sign_ups_num: get_info.sign_ups_num,
                activity_name: get_info.activity_name
            });
        })
};

exports.bid_detail = function (req, res) {
    var get_info = querystring.parse(url.parse(req.url).query);
    BidResult.reconstruct_bid_result(req.session.user.name,get_info.activity_name,get_info.bid_name)
        .then(function(bid_result){
            req.session.bid_result = bid_result;
            res.render("bid_detail", {
                user: req.session.user,
                bid_result: bid_result,
                sign_ups_num: get_info.sign_ups_num,
                activity_name: get_info.activity_name
            });
        })
};

exports.price_statistics = function (req, res) {
    var bid_result = req.session.bid_result;
    BidPeople.reconstruct_prices_list(bid_result.user,bid_result.activity_name,bid_result.bid_name)
        .then(function(prices_list){
            res.render("price_statistics", {
                user: req.session.user,
                prices_list: prices_list,
                sign_ups_num: querystring.parse(url.parse(req.url).query).sign_ups_num,
                bid_result: bid_result
            });
        })
};

exports.syn_show = function(req,res){
    Activity.reconstruct_syn_show_info(req.session.user)
        .then(function(syn_show_info){
            SignUp.count_sign_ups_num(req.session.user.name,syn_show_info.activity_name)
                .then(function(sign_ups_num){
                    syn_show_info.sign_ups_num = sign_ups_num;
                    return syn_show_info;
                })
                .done(function(syn_show_info){
                    BidWinner.get(req.session.user.name)
                        .then(function(bid_winner){
                            res.render('syn_show',{
                                syn_show_info:syn_show_info,
                                bid_winner:bid_winner[0].bid_winner[0]
                            });
                        })
                })
        })
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
    User.judge_reset_password_input(req, res);
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
    var newBidPeople = new BidPeople(req.body.login_user, req.body.bid_peoples);
    var newSignUp = new SignUp(req.body.login_user, req.body.sign_ups);
    var newBidResult = new BidResult(req.body.login_user, req.body.bid_results);

    newActivity.update(function (err, activity) {});
    newBid.update(function (err, bid) {});
    newBidPeople.update(function (err, bid_people) {});
    newSignUp.update(function (err, sign_up) {});
    newBidResult.update(function (err, sign_up) {});

    res.write('true');
    res.end();
};

exports.process_syn_show_winner_data = function(req,res){
    if(req.body.user == req.session.user.name){
        var newBidWinner = new BidWinner(req.session.user.name,req.body.bid_winner);
        newBidWinner.update(function (err, bid_winner) {});
    }
    res.write('true');
    res.end();
};

