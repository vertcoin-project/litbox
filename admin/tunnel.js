const fs = require('fs')
const path = require('path')
const Client = require('ssh2').Client

module.exports = {};


module.exports.checkTunnel = function(callback) {
    var conn = new Client();
    conn.on('ready', function() {
        callback(null, true);
        conn.end();
      }).on('error', function(err) {
        callback(err, false);
      }).connect({
        host: 'litbox-tunnel',
        port: 22,
        username: 'root',
        privateKey: fs.readFileSync(path.join('/root/secrets/litbox-admin.key'))
      });
}