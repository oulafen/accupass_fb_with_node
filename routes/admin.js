var User = require('../models/user');

exports.admin_index = function (req, res) {
    res.render("admin_index", {
        users: req.session.users
    });
};

