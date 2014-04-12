
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

exports.process_register_info = function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_confirmation = req.body.password_confirmation,
        forgot_password_question = req.body.forgot_password_question,
        forgot_password_answer = req.body.forgot_password_answer;

    console.log(name,password,'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')

    //检验是否为空
    if(!name||!password||!password_confirmation||!forgot_password_answer||!forgot_password_question){
        req.flash('error', '输入不能为空!');
        console.log('++++++++++++++++++++++++++++++')
        return res.redirect('user_register');//返回注册页
    }

    //检验用户两次输入的密码是否一致
    if (password_confirmation != password) {
        req.flash('error', '两次输入的密码不一致!');
//        return res.render("user_register");//返回注册页
    }
    //生成密码的 md5 值
//    var md5 = crypto.createHash('md5'),
//        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: req.body.name,
        password: password,
        forgot_password_question: forgot_password_question,
        forgot_password_answer: forgot_password_answer
    });

    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (user) {
//            req.flash('error', '用户已存在!');
            return res.redirect('/user_register');//返回注册页
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
//                req.flash('error', err);
                return res.redirect('/user_register');//注册失败返回主册页
            }
            req.session.user = name;//用户信息存入 session
//            req.flash('success', '注册成功!');
            res.redirect('/user_index');//注册成功后返回主页
        });
    });
}
