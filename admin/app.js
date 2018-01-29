var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hash = require('pbkdf2-password')()

var index = require('./routes/index');
var auth = require('./routes/auth');
var status = require('./routes/status');

var app = express();

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: require('crypto').randomBytes(64).toString('hex'), resave: false, saveUninitialized: false }));


// authentication setup
var passport = require('./passport.config');
app.use(passport.initialize());
app.use(passport.session());

// create default root password if it does not exist
if(!fs.existsSync(path.join(__dirname, 'admin_password'))) {
  hash({ password: 'admin' }, function (err, pass, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"
    fs.writeFile(path.join(__dirname, 'admin_password'), "admin\t" + salt + "\t" + hash, (err) => {
      if(err) console.error(err);
      else console.log("Default admin password file written");
    });
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/status', status);

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
