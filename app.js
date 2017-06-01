var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);//在mongoDB中存储session
var bodyParser = require('body-parser');
var passport = require('passport');//密码注册登录验证模块


var User = require('./models/user');

var dbUrl = 'mongodb://localhost/discountWeb'; //'mongodb://hrt:060304@ds113630.mlab.com:13630/discount-web';

passport.use(User.createStrategy());
var app = express();

mongoose.Promise = global.Promise;  
mongoose.connect(dbUrl);



// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.locals.moment = require('moment');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({limit: "1mb", extended: true }));
app.use(cookieParser());

app.use(session({
	secret: 'zhidegou', 
	resave: false, 
	store: new mongoStore({
		url: dbUrl,
		collection: 'session'
	}),
	saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

//将用户信息传入所有模板
app.use(function (req, res, next) {
    res.locals.user = req.user;   
    next();
});

var routes = require('./config/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
