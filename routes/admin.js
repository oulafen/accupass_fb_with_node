var User = require('../models/user');
var url = require('url');
var querystring = require('querystring');
//var $ = require("jquery");
var pagination = require('pagination');
var crypto = require('crypto');


exports.admin_index = function (req, res) {
    if (req.session.admin) {
        req.session.change_success = '';
        var paginator = pagination.create('search', {prelink: '/admin_index', current: 1, rowsPerPage: 10,
            totalResult: 10020});
        res.render("admin_index", {
            users: req.session.users,
            delete_user: req.session.delete_user,
            delete_user_name: req.session.delete_user_name,
            paginator: paginator.render()
        });
    } else {
        res.redirect('/')
    }
};

exports.change_password = function (req, res) {
    if (req.session.admin) {
        res.render("change_password", {
            change_success: req.session.change_success,
            error: req.flash('error').toString(),
            name: req.session.user_name
        })
    } else {
        res.redirect('/')
    }
};

exports.add_user = function (req, res) {
    if (req.session.admin) {
        res.render('add_user', {
            error: req.flash('error').toString()
        });
    } else {
        res.redirect('/')
    }
};

exports.update_password = function (req, res) {
    if (req.session.admin) {
        var name = req.session.user_name;
        var is_input = User.judge_change_password_input(req, res);
        var password = User.crypto_password(req.body.password);
        if (is_input == 'legal') {
            User.get(name, function (err, user) {
                if (user) {
                    user.password = password;
                    User.update(user, function (err, user) {
                        if (user) {
                            req.session.change_success = 'success';
                            res.redirect('/change_password');
                        }
                    });
                }
            })
        }
    } else {
        res.redirect('/')
    }
};

exports.close_change_success_confirm = function (req, res) {
    req.session.change_success = '';
    res.redirect('/change_password');
};

exports.show_delete_user_confirm = function (req, res) {
    req.session.delete_user = 'clicked';
    req.session.delete_user_name = querystring.parse(url.parse(req.url).query).name;
    res.redirect('/admin_index');
};

exports.close_delete_user_confirm = function (req, res) {
    req.session.delete_user = '';
    req.session.delete_user_name = '';
    res.redirect('/admin_index');
};

exports.create_admin_session = function (req, res) {
    req.session.user_name = querystring.parse(url.parse(req.url).query).name;
    res.redirect('/change_password');
};

exports.create_new_user = function (req, res) {
    if (req.session.admin) {
        var is_legal = User.judge_add_user_input(req, res) == 'legal';
        var password = User.crypto_password(req.body.password);
        var user = req.body;
        user.password = password;
        if (is_legal) {
            var newUser = new User(user);
            User.get(newUser.name, function (err, user) {
                if (user) {
                    req.flash('error', '用户已存在!');
                    return res.redirect('/add_user');
                }
                newUser.save(function (err, user) {
                    if (user) {
                        User.find_all_users('user', function (err, users) {
                            if (users) {
                                req.session.users = users;
                                res.redirect('/add_user');
                            }
                        })
                    }
                });
            });
        }
    } else {
        res.redirect('/')
    }
};

exports.delete_user = function (req, res) {
    if (req.session.admin) {
        req.session.delete_user = '';
        User.get(req.session.delete_user_name, function (err, user) {
            if (user) {
                User.delete_user(user, function (err, user) {
                    if (user) {
                        User.find_all_users("user", function (err, users) {
                            if (users) {
                                req.session.users = users;
                                res.redirect('/admin_index');
                            }
                        })
                    }
                })
            }
        });
        req.session.delete_user_name = '';
    } else {
        res.redirect('/')
    }
};
