const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const MemoryStream = require('memory-stream');

/* GET pairing page. */
router.get('/', ensure.ensureLoggedIn('/auth/login'), function(req, res, next) {
    // Read TOR Hostname
    var torHost = fs.readFileSync('/root/tor/hostname').toString().replace('\n','');
    
    // Generate pairing request id
    var requestId = uuidv4();

    // Generate HMAC key for one-time use
    crypto.randomBytes(256, (err, buf) => {
        if (err) 
        {
            console.log(err);
            return res.sendStatus(500);
        }
        var hmacSecret = buf.toString('hex');
        var pairObj = { 
            id : requestId,
            torHost : torHost,
            hmacSecret : hmacSecret 
        };
            
        
        QRCode.toFile(path.join(__dirname,"/../pairingRequests/" + requestId + ".png"), JSON.stringify(pairObj), {}, function (err) {
            if (err) 
            {
                console.log(err);
                return res.sendStatus(500);
            }
            fs.writeFile(path.join(__dirname,"/../pairingRequests/" + requestId + ".json"), pairObj, function(err) {
                if (err) 
                {
                    console.log(err);
                    return res.sendStatus(500);
                }
                res.render('pair', { qrfile : "/pair/qr/" + requestId, pairfile : "/pair/pairFile/" + requestId });
            });
        });
    });    
});

router.get('/qr/:id', ensure.ensureLoggedIn('/auth/login'), function(req, res, next) {
    var requestId = req.params.id;
    fs.stat(path.join(__dirname,"/../pairingRequests/" + requestId + ".png"), function(err, stats) {
        if (err) return res.sendStatus(500);
        var createdAgo = (new Date().getTime() - new Date(stats.mtime).getTime()) / 1000;
        if(createdAgo >= 300) return res.sendStatus(500); // Longer than 5 minutes old
        res.header("Content-Type","image/png");
        res.sendFile(path.join(__dirname,"/../pairingRequests/" + requestId + ".png"));
    });
});

router.get('/pairFile/:id', ensure.ensureLoggedIn('/auth/login'), function(req, res, next) {
    var requestId = req.params.id;
    fs.stat(path.join(__dirname,"/../pairingRequests/" + requestId + ".json"), function(err, stats) {
        if (err) return res.sendStatus(500);
        var createdAgo = (new Date().getTime() - new Date(stats.mtime).getTime()) / 1000;
        if(createdAgo >= 300) return res.sendStatus(500); // Longer than 5 minutes old
        res.header("Content-Type","application/json");
        res.header("Content-Disposition","attach; filename=pair.json");
        
        res.sendFile(path.join(__dirname,"/../pairingRequests/" + requestId + ".json"));
    });
});


module.exports = router;
