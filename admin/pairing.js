var express = require('express');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var bodyParser = require('body-parser');

var tunnel = require('./tunnel');
const uuidv4 = require('uuid/v4');

var app = express();

app.use(bodyParser.json());

app.post('/pair', function(req, res, next) {
    const signature = req.headers["x-hmac-signature"];
    const body = req.body;

    var testSignature = crypto.createHmac("sha256", "abc123").update(JSON.stringify(body)).digest("base64")

    console.log("Pairing request received. Signature: [", signature , "] [", testSignature ,"] \r\n\r\n Request: \r\n" , body);

    if(signature === testSignature) { 
        var requestId = uuidv4();

        fs.writeFileSync("/root/keys/" + requestId + ".crt", "-----BEGIN RSA PUBLIC KEY-----\n" + req.body.publicKey + "\n-----END RSA PUBLIC KEY-----");
        tunnel.executeCommand('/root/generate_authorized_keys.sh', (err, success) => {
            if(err) {
                console.error(err);
                return res.sendStatus(500);
            }
            
            if(success) {
                res.sendStatus(201);
            } 
            else
            {
                res.sendStatus(500);
            }
        });
    } else {
        return res.sendStatus(500);
    }



});

module.exports = app;
