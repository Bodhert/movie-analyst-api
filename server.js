const express = require('express');
const mysql = require('mysql');
const http = require('http');
const request = require('request');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000
let connection

if (process.env.NODE_ENV != 'test') {
  connection = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql-test.cxrpknmq0hfi.us-west-2.rds.amazonaws.com',
    user: process.env.DB_USER || 'applicationuser',
    password: process.env.DB_PASS || 'applicationuser',
    database: process.env.DB_NAME || 'movie_db'
  });

  connection.connect(function (error) {
    if (error) {
      console.log('eye with that my hand, error connecting to the DB')
      console.log(error)
    } else {
      console.log('the good, db is conected')
    }
  });
}



// Testing endpoint
app.get('/', function (req, res) {
  var response = [{ response: 'hello' }, { code: '200' }]
  res.json(response);
})

app.get('/reviewers', function (req, res) {
  getAllfromTable('reviewer', function (reviewsResult) {
    res.json(reviewsResult);
  });
})

app.get('/publications', function (req, res) {
  getAllfromTable('publication', function (publicationsResult) {
    res.json(publicationsResult);
  });
})

app.get('/movies', function (req, res, next) {
  getAllfromTable('moviereview', function (moviesResult) {
    res.json(moviesResult);
  });
});

function getAllfromTable(table, callback) {
  connection.query(`SELECT * FROM ${table}`,
    function (err, result) {
      if (err) {
        return callback(err)
      }
      callback(result);
    }
  );
}

app.get('/ip', function (req, res, next) {

  http.get('http://169.254.169.254/latest/meta-data/local-hostname', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      res.json(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.json('cannot get aws metadata, error: ' + err.message);
  });

});

app.listen(port);
console.log("server listening through port: " + port);

module.exports = app; 
