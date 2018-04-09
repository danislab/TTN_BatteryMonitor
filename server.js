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

    pg_db.query('CREATE TABLE IF NOT EXISTS measurements ( \
      id SERIAL PRIMARY KEY, \
      deviceid TEXT, \
      counter INTEGER, \
      time TIMESTAMPTZ, \
      soc INTEGER, \
      soh INTEGER, \
      cell_voltage_mean REAL, \
      cell_voltage_min REAL, \
      cell_voltage_max REAL, \
      temperature_mean REAL, \
      temperature_min REAL, \
      temperature_max REAL, \
      charged_capacity_1cs INTEGER, \
      discharged_capacity_1cs INTEGER)', (err, res) => { });
    pg_db.query('CREATE TABLE IF NOT EXISTS raw_data(id SERIAL PRIMARY KEY, json_string TEXT)', (err, res) => { });
    console.log("Prepared database")

    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID, "counter", payload.counter)
      //console.log(payload.payload_fields.measurement)

      try {
        pg_db.query('INSERT INTO measurements(deviceid, counter, time, soc, soh, \
          cell_voltage_mean, cell_voltage_min, cell_voltage_max, \
          temperature_mean, temperature_min, temperature_max, \
          charged_capacity_1cs, discharged_capacity_1cs \
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [payload.dev_id,
        payload.counter,
        payload.metadata.time,
        payload.payload_fields.measurement.soc,
        payload.payload_fields.measurement.soh,
        payload.payload_fields.measurement.cell_voltage_mean,
        payload.payload_fields.measurement.cell_voltage_min,
        payload.payload_fields.measurement.cell_voltage_max,
        payload.payload_fields.measurement.temperature_mean,
        payload.payload_fields.measurement.temperature_min,
        payload.payload_fields.measurement.temperature_max,
        payload.payload_fields.measurement.charged_capacity_1cs,
        payload.payload_fields.measurement.discharged_capacity_1cs], (err, res) => { });

        // store entire JSON string
        pg_db.query('INSERT INTO raw_data (json_string) VALUES($1)', [JSON.stringify(payload)], (err, res) => { });
        io.emit('chat message', [JSON.stringify(payload)]);
      } catch (err) {
        console.error('There was an error in payload', err);
      }

      pg_db.query('SELECT * FROM measurements', (err, res) => {
        io.emit('table', JSON.stringify(res.rows));
      });
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/rt', function(req, res){
  res.sendFile(__dirname + '/public/rt_table.html');
});

app.get('/console', function(req, res){
  res.sendFile(__dirname + '/public/console.html');
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
