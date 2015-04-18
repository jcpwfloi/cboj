var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var problem = require('./routes/problem');
var problems = require('./routes/problems');
var admin = require('./routes/admin');
var submit = require('./routes/submit');
var stats = require('./routes/status');
var RedisStore = require('connect-redis')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// session support
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'rhfhgGG77488aguriuy2875',
	proxy: 'true',
    store: new RedisStore({
            host: '901523a3e35211e4.m.cnhza.kvstore.aliyuncs.com',
            pass: '901523a3e35211e4:Czr88159080',
            port: '6379'
        })
	/*store: require('sessionstore').createSessionStore({
		type: 'redis',
        host: '901523a3e35211e4.m.cnhza.kvstore.aliyuncs.com',
		port: 6379,
		prefix: 'sess',
        ttl: 804600,
        timeout: 10000
	})*/
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/problem', problem);
app.use('/problems', problems);
app.use('/admin', admin);
app.use('/submit', submit);
app.use('/status', stats);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
