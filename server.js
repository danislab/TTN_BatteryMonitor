var ttn = require('ttn');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var pug = require('pug');
var sqlite3 = require('sqlite3').verbose();

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(express.static('public'));

var region = 'eu';
var appID = "danislab_test_application"
var accessKey = 'ttn-account-v2.LyHGChuHnRuFgVySuUGNKhKioaCzEJrxHpy0NdKcGjw';

var db = new sqlite3.Database('./ttn_database.db');

ttn.data(appID, accessKey)
  .then(function (client) {
    console.log("Connected to TTN")
    db.run("CREATE TABLE IF NOT EXISTS measurements (deviceid TEXT, counter INTEGER, time TEXT, humidity REAL, temperature REAL)");
    db.run("CREATE TABLE IF NOT EXISTS RAW_data (JSON_string TEXT)");
    console.log("Prepared database")
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)
      //console.log(payload.metadata.gateways)
      //console.log(payload.metadata.time)
      //console.log(payload.counter)
      //console.log(payload.payload_raw)
      //console.log(payload.payload_fields)
      //console.log(payload.payload_fields.measurement.humidity)

      // insert one row into the langs table
      db.run("INSERT INTO measurements(deviceid, counter, time, humidity, temperature) VALUES(?, ?, ?, ?, ?)",
        [payload.dev_id,
        payload.counter,
        payload.metadata.time,
        payload.payload_fields.measurement.humidity,
        payload.payload_fields.measurement.temperature], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);    // get the last insert id
      });
      // store entire JSON string
      db.run("INSERT INTO RAW_data(JSON_string) VALUES(?)", [JSON.stringify(payload)], function(err) {
        if (err) {
          return console.log(err.message);
        }
        //console.log(`A row has been inserted with rowid ${this.lastID}`);    // get the last insert id
      });
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

app.get("/", function(req, res) {
  res.render('index');
});

process.on('exit', function () {
  console.log('About to exit.');
  db.close();
});



