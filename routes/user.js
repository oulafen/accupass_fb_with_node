
var User = require('../models/user');

exports.register = function(req, res){
    res.render("user_register",{
        error: req.flash('error').toString()
    });
};

exports.user_index = function(req, res){
    res.render("user_index",{
       user: req.session.user
    });
};

exports.create_login_session = function(req, res){
    var is_legal = judge_login_input(req, res);
    if(is_legal == 'legal'){
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '该用户不存在!');
                return res.redirect('/');
            }
            if (user.password!=req.body.password){
                req.flash('error', '输入密码不正确!');
                return res.redirect('/');
            }
            req.session.user = user;
            if(user.login_type=='user'){
                res.redirect('/user_index');
            }
            if(user.login_type=='admin'){
                res.redirect('/admin_index');
            }

        });
    }
};

exports.process_register_info = function (req, res) {
    var is_legal = judge_register_input(req,res);
    if(is_legal=='legal'){
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
}

function judge_register_input(req,res){
    var name = req.body.name,
        password = req.body.password,
        password_confirmation = req.body.password_confirmation,
        forgot_password_question = req.body.forgot_password_question,
        forgot_password_answer = req.body.forgot_password_answer;
    if(!name||!password||!password_confirmation||!forgot_password_answer||!forgot_password_question){
        req.flash('error', '输入不能为空!');
        return res.redirect('user_register');
    }
    if (password_confirmation != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect("user_register");
    }
    return 'legal';
}

function judge_login_input(req, res){
    var name = req.body.name,
        password = req.body.password;
    if(!name||!password){
        req.flash('error', '输入不能为空!');
        return res.redirect('/');
    }
    return 'legal';
}
