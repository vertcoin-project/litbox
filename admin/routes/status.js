var express = require('express');
var router = express.Router();
var ensure = require('connect-ensure-login');
var fs = require('fs');
var tunnel = require('../tunnel');
var lit = require('../lit');

router.get('/', ensure.ensureLoggedIn('/auth/login'), function(req, res, next) {
    var torHost = fs.readFileSync('/root/tor/hostname');
    tunnel.checkTunnel((err, success) => {
        var ws = lit.connect();
        ws.on('open', () => {
            lit.getBalance(ws, (litErr, data) => {
                if(data.result && data.error == null) {
                    res.render('status', { torHost: torHost, litStatus: true, litError: null, tunnelStatus: success, tunnelError: err });
                } else {
                    res.render('status', { torHost: torHost, litStatus: false, litError: data.error, tunnelStatus: success, tunnelError: err });
                }
            });
        });
        ws.on('error', (litErr) => {
            ws.close();
            res.render('status', { torHost: torHost, litStatus: false, litError: JSON.stringify(litErr), tunnelStatus: success, tunnelError: err });
        });
    });
});

module.exports = router;