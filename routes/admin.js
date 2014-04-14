var User = require('../models/user');
var url = require('url');
var querystring = require('querystring');

exports.admin_index = function (req, res) {

    res.render("admin_index", {
        users: req.session.users
    });
};

exports.change_password = function(req,res){

    res.render("change_password",{
        error: req.flash('error').toString(),
        name:  req.session.user_name
    })
};

exports.add_user = function(req,res){
    res.render('add_user');
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
                        res.redirect('/admin_index');
                    }
                });
            }
        })
    }
};

exports.create_admin_session = function(req,res){
    req.session.user_name=querystring.parse(url.parse(req.url).query).name;
    res.redirect('/change_password');
};

