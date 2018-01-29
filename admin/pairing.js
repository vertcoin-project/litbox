var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
app.use(require('body-parser').json());

app.post('/pair', function(req, res, next) {
    console.log("Pairing request received");
    res.sendStatus(201);
});

module.exports = app;
