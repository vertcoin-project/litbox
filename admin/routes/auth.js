var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/login', function(req,res,next) {
  res.render('login');
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/auth/login?error=1' }),
  function(req, res) {
    res.redirect('/');
  });
  
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

module.exports = router;
