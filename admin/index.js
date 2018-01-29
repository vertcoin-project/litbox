const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const Client = require('ssh2').Client

app.use(express.static('static'));

app.get('/backend/check-tunnel', (req, res, next) => {
    var conn = new Client();
    conn.on('ready', function() {
        res.json({ok:true});
      }).on('error', function(err) {
        res.json({ok : false, error : err});
      }).connect({
        host: 'vertcoin-box-tunnel',
        port: 22,
        username: 'root',
        privateKey: fs.readFileSync(path.join(__dirname,'vertcoin-box-admin.key'))
      });
});

app.listen(80, () => console.log('Example app listening on port 80!'))