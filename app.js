'use strict';

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

// Routes

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// Http headers

// Base routes

app.get('/test', function(req, res) {
    res.status(200).send({message: '👽 Hello World..!!'})
});

module.exports = app;
