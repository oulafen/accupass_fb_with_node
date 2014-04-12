
/*
 * GET users listing.
 */

var User = require('../models/user');

exports.list = function(req, res){
  res.send("respond with a resource");
};

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

exports.process_register_info = function (req, res) {
    var is_legal = judge_input(req,res);
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

function judge_input(req,res){
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
