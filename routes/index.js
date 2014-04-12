
exports.login = function(req, res){
  res.render('index',{
      error: req.flash('error').toString()
  });
};

exports.logout = function(req, res){
    req.session.user = null;
    res.redirect('/')
}

