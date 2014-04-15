
/**
 * Module dependencies.
 */

var express = require('express');
var index = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');


var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//index
app.get('/', index.login);
app.get('/logout',index.logout);

//admin
app.get('/admin_index',admin.admin_index);
app.get('/add_user',admin.add_user);
app.get('/change_password',admin.change_password);
app.get('/create_admin_session',admin.create_admin_session);
app.get('/delete_user',admin.delete_user);
app.get('/close_change_success_confirm',admin.close_change_success_confirm);

app.post('/update_password',admin.update_password);
app.post('/add_user',admin.create_new_user);


//user
app.get('/user_register', user.register);
app.get('/user_index',user.user_index);
app.get('/forgot_1',user.forgot_1);
app.get('/forgot_2',user.forgot_2);
app.get('/forgot_3',user.forgot_3);

app.post('/forgot_pw_1',user.forgot_pw_1);
app.post('/judge_answer',user.judge_answer);
app.post('/reset_password',user.reset_password);
app.post('/create_login_session',user.create_login_session);



app.post('/user_register',user.process_register_info);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
