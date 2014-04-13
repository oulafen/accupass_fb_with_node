var User = require('../models/user');

exports.admin_index = function (req, res) {
    res.render("admin_index", {
        users: req.session.users
    });
};

exports.change_password = function(req,res){
    console.log(req.url['change_password?name'],'++++++++++++++++++++++++user.name')
    res.render("change_password",{
        name: req.session.name
    })
};

exports.add_user = function(req,res){
    res.render('add_user');
};

//exports.create_admin_session = function(req,res){
//    req.session.user_name = req.body.name;
//    req.redirect("/change_password")
//};

