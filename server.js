var ttn = require('ttn');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var pug = require('pug');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const pg_db = require('./db')

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(express.static('public'));

var region = 'eu';
var appID = "danislab_test_application"
var accessKey = 'ttn-account-v2.LyHGChuHnRuFgVySuUGNKhKioaCzEJrxHpy0NdKcGjw';

ttn.data(appID, accessKey)
  .then(function (client) {
    console.log("Connected to TTN")

    pg_db.query('CREATE TABLE IF NOT EXISTS measurements (id SERIAL PRIMARY KEY, deviceid TEXT, counter INTEGER, time TEXT, humidity REAL, temperature REAL)', function( queryError, result ) {
      console.log('queried',queryError);
    });
    pg_db.query('CREATE TABLE IF NOT EXISTS raw_data(id SERIAL PRIMARY KEY, json_string TEXT)', function( queryError, result ) {
      console.log('queried',queryError);
    });
    console.log("Prepared database")

    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)

      // insert one row into the langs table
      pg_db.query('INSERT INTO measurements(deviceid, counter, time, humidity, temperature) VALUES($1, $2, $3, $4, $5)',
      [payload.dev_id,
      payload.counter,
      payload.metadata.time,
      payload.payload_fields.measurement.humidity,
      payload.payload_fields.measurement.temperature],
      function( queryError, result ) {
        console.log('queried',queryError);
      });

      // store entire JSON string
      pg_db.query('INSERT INTO raw_data (json_string) VALUES($1)', [JSON.stringify(payload)], function( queryError, result ) {
        console.log('queried',queryError);
      });
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

process.on('exit', function () {
  console.log('About to exit.');
  db.close();
});
