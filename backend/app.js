const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path    = require('path');


//load routes
const articles = require('./routes/articles.route.js');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

//allow static files to access
app.use("/images", express.static(path.join("backend/images")));
//CORS setting 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH,PUT,DELETE, OPTIONS"
    );
    next();
  });

// Configuring the database
const dbConfig = require('./config/db.config.js');

mongoose.Promise = global.Promise

mongoose.connect(dbConfig.url);

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...')
    process.exit()
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database")
});

app.use('/api/v1/articles',articles);

// define default route
app.get('/', function(req, res){
    res.send('Working...');
})

module.exports = app;