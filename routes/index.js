
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.logout = function(req, res){
    req.session.user = null;
    res.redirect('/')
}

