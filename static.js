var express = require('express');
var app = express();
app.use('/:prefix', express.static(__dirname + 'client'));
app.use('/', express.static('client'));
module.exports = function start(port) {

  server = app.listen(port, function () {
    console.log('Basic-ss live at', port);      
  });

};
