var User = require('../models/user');

exports.admin_index = function (req, res) {
    res.render("admin_index", {
        users: req.session.users
    });
};

exports.change_password = function(req,res){
    res.render("change_password",{
        name: req.body.name
    })
};

