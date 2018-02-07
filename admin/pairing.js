var express = require('express');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.post('/pair', function(req, res, next) {
    const signature = req.headers["x-hmac-signature"];
    const body = req.body;

    var testSignature = crypto.createHmac("sha256", "abc123").update(JSON.stringify(body)).digest("base64")

    console.log("Pairing request received. Signature: [", signature , "] [", testSignature ,"] \r\n\r\n Request: \r\n" , body);


    res.sendStatus(201);
});

module.exports = app;
