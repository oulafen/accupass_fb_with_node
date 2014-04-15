var User = require('../models/user');
var url = require('url');
var querystring = require('querystring');
//var $ = require("jquery");

exports.admin_index = function (req, res) {
    req.session.change_success = '';
    res.render("admin_index", {
        users: req.session.users
    });
};

exports.change_password = function(req,res){

    res.render("change_password",{
        change_success: req.session.change_success,
        error: req.flash('error').toString(),
        name:  req.session.user_name
    })
};

exports.add_user = function(req,res){
    res.render('add_user',{
        error: req.flash('error').toString()
    });
};

exports.update_password = function(req,res){
    var name = req.session.user_name;
    var is_input = User.judge_change_password_input(req,res);
    if(is_input == 'legal'){
        User.get(name,function(err,user){
            if(user){
                user.password = req.body.password;
                User.update(user,function(err,user){
                    if(user){
                        req.session.change_success = 'success';
                        res.redirect('/change_password');
                    }
                });
            }
        })
    }
};

exports.close_change_success_confirm = function(req,res){
    req.session.change_success = '';
    res.redirect('/change_password');
};

exports.create_admin_session = function(req,res){
    req.session.user_name = querystring.parse(url.parse(req.url).query).name;
    res.redirect('/change_password');
};

exports.create_new_user = function(req,res){
    var is_legal = User.judge_add_user_input(req,res) == 'legal';
    if(is_legal){
        var newUser = new User(req.body);
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/add_user');
            }
            newUser.save(function (err, user) {
               if(user){
                   User.find_all_users('user', function (err, users) {
                       if (users) {
                           req.session.users = users;
                           res.redirect('/add_user');                       }
                   })
               }
            });
        });
    }
};

exports.delete_user = function(req,res){
    var user_name = querystring.parse(url.parse(req.url).query).name;
        User.get(user_name,function(err,user){
            if(user){
                User.delete(user,function(err,user){
                    if(user){
                        User.find_all_users("user",function(err,users){
                            if(users){
                                req.session.users = users;
                                res.redirect('/admin_index');
                            }
                        })
                    }
                })
            }
        });
};

//function change_success_show(){
//    var $ = require("jquery");
//    $(document).ready(function(){
//        $('#change_success').show(400)
//    });
//    $('#close').click(function(){
//        $('#change_success').hide(400)
//    });
//}
