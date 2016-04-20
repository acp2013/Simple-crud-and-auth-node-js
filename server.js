var express = require('express');
var debug = require('debug')('passport-mongo');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// load database
var dbConfig = require('./db');
var mongoose = require('mongoose');

// koneksi ke db
mongoose.connect(dbConfig.url);

var app = express();

// setting template jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(bodyParser({ keepExtensions: true, uploadDir: "images" })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setting passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

//cek login
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

 // flash untuk koneksi session ke template
var flash = require('connect-flash');
app.use(flash());

// init Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes')(passport);
app.use('/', routes);

// catch 404 error
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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

app.set('port', process.env.PORT || 3000);



var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

