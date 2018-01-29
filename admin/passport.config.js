var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var hash = require('pbkdf2-password')()
var fs = require('fs');
var path = require('path');
passport.use(new Strategy(
    function(username, password, cb) {
      fs.readFile(path.join(__dirname,"admin_password"), (err, data) => {
        if(err) return cb(err);
        var passwordData = data.toString().split('\t');
        if(username !== passwordData[0]) return cb(null, false);

        hash({ password: password, salt: passwordData[1] }, function (err, pass, salt, hash) {
          if (err) return cb(err);
          if (hash == passwordData[2]) return cb(null, {username:'admin', id: 0});
          else return cb(null, false);
        });
      });
    })
);

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });
  
  passport.deserializeUser(function(id, cb) {
    if(id == 0) { 
      return cb(null, {id:0, username:'admin'});
    }
    cb(new Error("User invalid"), null);
  });

module.exports = passport;
