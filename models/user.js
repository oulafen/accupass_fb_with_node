var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.forgot_password_question = user.forgot_password_question;
    this.forgot_password_answer = user.forgot_password_answer;
    this.login_type = 'user';
};

module.exports = User;

User.prototype.save = function (callback) {
    var user = {
        name: this.name,
        password: this.password,
        forgot_password_question: this.forgot_password_question,
        forgot_password_answer: this.forgot_password_answer,
        login_type: this.login_type
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(user, {
                    safe: true
                }, function (err, user) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, user[0]);
                }
            );
        });
    });
};

//User.prototype.update_password = function(password,callback){
//
//    var user = {
//        name: this.name,
//        password: password,
//        forgot_password_question: this.forgot_password_question,
//        forgot_password_answer: this.forgot_password_answer,
//        login_type: this.login_type
//    };
//    mongodb.open(function (err, db) {
//        db.users.update({'name':},);
//        db.collection('users', function (err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);
//            }
//            collection.insert(user, {
//                    safe: true
//                }, function (err, user) {
//                    mongodb.close();
//                    if (err) {
//                        return callback(err);
//                    }
//                    callback(null, user[0]);
//                }
//            );
//        })
//    });

//};

User.get = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
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

