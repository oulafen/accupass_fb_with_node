var User = require('../models/user');

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

exports.create_login_session = function (req, res) {
    var is_legal = User.judge_login_input(req, res);
    if (is_legal == 'legal') {
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '该用户不存在!');
                return res.redirect('/');
            }
            if (user.password != req.body.password) {
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
    if (is_legal == 'legal') {
        var newUser = new User(req.body);
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




