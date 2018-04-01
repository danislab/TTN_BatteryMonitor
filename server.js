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

    pg_db.query('CREATE TABLE IF NOT EXISTS measurements (id SERIAL PRIMARY KEY, deviceid TEXT, counter INTEGER, time TIMESTAMPTZ, humidity REAL, temperature REAL)', (err, res) => { });
    pg_db.query('CREATE TABLE IF NOT EXISTS raw_data(id SERIAL PRIMARY KEY, json_string TEXT)', (err, res) => { });
    console.log("Prepared database")

    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID, "counter", payload.counter)
      //console.log(payload)

      // insert one row into the langs table
      pg_db.query('INSERT INTO measurements(deviceid, counter, time, humidity, temperature) VALUES($1, $2, $3, $4, $5)',
      [payload.dev_id,
      payload.counter,
      payload.metadata.time,
      payload.payload_fields.measurement.humidity,
      payload.payload_fields.measurement.temperature], (err, res) => { });

      // store entire JSON string
      pg_db.query('INSERT INTO raw_data (json_string) VALUES($1)', [JSON.stringify(payload)], (err, res) => { });
      io.emit('chat message', [JSON.stringify(payload)]);
      //io.emit('table', payload.metadata.time);
      pg_db.query('SELECT * FROM measurements', (err, res) => {
      /*pg_db.query('SELECT * FROM measurements', function(err, res) {
    		//pg_db.done(); // Call done() to release the client back to the pool
    		if(err) {
    			return console.error('Query error', err);
    		}*/
        //console.log(JSON.stringify(res.rows[1]))
        io.emit('table', JSON.stringify(res.rows));
      });
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

app.get('/rt', function(req, res){
  res.sendFile(__dirname + '/web/rt_table.html');
});

app.get('/console', function(req, res){
  res.sendFile(__dirname + '/web/console.html');
});

app.get('/dbtest', function(req, res){
  res.sendFile(__dirname + '/web/dbtest.html');
  io.emit('table', JSON.stringify(res.rows));
});

app.get('/overview', function(req, res){
  res.sendFile(__dirname + '/web/overview.html');
  io.emit('table', 'hier sollte meine Tabelle sein');
});

io.on('connection', function(socket){
  console.log('a user connected');
  pg_db.query('SELECT * FROM measurements', (err, res) => {
    io.emit('table', JSON.stringify(res.rows));
  });
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
