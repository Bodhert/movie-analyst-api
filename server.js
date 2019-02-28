const express = require('express');
const mysql = require('mysql');
const http = require('http');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000

const connection = mysql.createConnection({
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

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });

    res.on('end', () => {
      console.log('No more data in response.');
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    
  });
});

app.listen(port);
console.log("server listening through port: " + port);

module.exports = app; 
