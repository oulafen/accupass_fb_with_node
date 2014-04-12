var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.forgot_password_question = user.forgot_password_question;
    this.forgot_password_answer = user.forgot_password_answer;
    this.login_type = 'user';
};

module.exports = User;

User.prototype.save = function(callback) {
    var user = {
        name: this.name,
        password: this.password,
        forgot_password_question: this.forgot_password_question,
        forgot_password_answer: this.forgot_password_answer,
        login_type: this.login_type
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(user, {
                safe: true
                }, function (err, user) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
                }
            );
        });
    });
};

User.get = function(name, callback) {
     mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};