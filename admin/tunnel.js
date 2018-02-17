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

module.exports.executeCommand = function(command, callback) {
  var conn = new Client();
  conn.on('ready', function() {
      conn.exec(command, function(err, stream) {
        if (err) callback(err, false);
        var commandErr = null;
        stream.on('close', function(code, signal) {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
          callback(commandErr, commandErr == null);
        }).on('data', function(data) {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', function(data) {
          console.log('STDERR: ' + data);
          commandErr = data;
        });
      });
    }).on('error', function(err) {
      callback(err, false);
    }).connect({
      host: 'litbox-tunnel',
      port: 22,
      username: 'root',
      privateKey: fs.readFileSync(path.join('/root/secrets/litbox-admin.key'))
    });
}