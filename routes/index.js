
exports.login = function(req, res){
  res.render('index',{
      error: req.flash('error').toString()
  });
};

exports.logout = function(req, res){
    req.session.delete_user = null;
    req.session.delete_user_name = null;
    req.session.users = null;
    req.session.user = null;
    res.redirect('/')
}

