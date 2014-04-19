var mongodb = require('./db');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/accupass_fb_with_node');

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    forgot_password_question:String,
    forgot_password_answer:String,
    login_type:String
}, {
    collection: 'users'
});

var userModel = mongoose.model('User', userSchema);

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.forgot_password_question = user.forgot_password_question;
    this.forgot_password_answer = user.forgot_password_answer;
    this.login_type = 'user';
}

User.prototype.save = function (callback) {
    var user = this;
    var newUser = new userModel(user);

    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.update = function (user, callback) {
    mongodb.open(function (err, db) {
        db.collection('users', function (err, collection) {
            collection.update({_id: user._id}, {name: user.name, password: user.password, forgot_password_question: user.forgot_password_question,
                forgot_password_answer: user.forgot_password_answer, login_type: user.login_type}, function (err, user) {
                mongodb.close();
                callback(null, user);
            });
        })
    });
};

User.get = function (name, callback) {
    userModel.findOne({name: name}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.find_all_users = function (login_type, callback) {
    mongodb.open(function (err, db) {
        db.collection('users', function (err, collection) {
            collection.find({login_type: login_type}).toArray(function (err, users) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, users);
                    mongodb.close();
                }
            });
        });
    });
};

User.judge_register_input = function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_confirmation = req.body.password_confirmation,
        forgot_password_question = req.body.forgot_password_question,
        forgot_password_answer = req.body.forgot_password_answer;
    if (!name || !password || !password_confirmation || !forgot_password_answer || !forgot_password_question) {
        req.flash('error', '输入不能为空!');
        return res.redirect('user_register');
    }
    if (password_confirmation != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect("user_register");
    }
    return 'legal';
};

User.judge_login_input = function (req, res) {
    var name = req.body.name,
        password = req.body.password;
    if (!name || !password) {
        req.flash('error', '输入不能为空!');
        return res.redirect('/');
    }
    return 'legal';
};

User.judge_change_password_input = function (req, res) {
    var password = req.body.password,
        password_confirmation = req.body.password_confirmation;
    if (!password || !password_confirmation) {
        req.flash('error', '输入不能为空!');
        return res.redirect('/change_password');
    }
    if (password != password_confirmation) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/change_password');
    }
    return 'legal';
};

User.judge_add_user_input = function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_confirmation = req.body.password_confirmation,
        forgot_password_question = req.body.forgot_password_question,
        forgot_password_answer = req.body.forgot_password_answer;
    if (!name || !password || !password_confirmation || !forgot_password_answer || !forgot_password_question) {
        req.flash('error', '输入不能为空!');
        return res.redirect('/add_user');
    }
    if (password_confirmation != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect("/add_user");
    }
    return 'legal';
};

User.delete = function (user,callback) {
    mongodb.open(function (err, db) {
        db.collection('users', function (err, collection) {
            collection.remove({_id: user._id}, function (err, user) {
                mongodb.close();
                callback(null, user);
            });
        })
    });
};

module.exports = User;




