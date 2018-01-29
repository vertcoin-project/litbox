var express = require('express');
var router = express.Router();
var ensure = require('connect-ensure-login');


/* GET home page. */
router.get('/', ensure.ensureLoggedIn('/auth/login'), function(req, res, next) {
  res.render('index', { });
});




module.exports = router;
