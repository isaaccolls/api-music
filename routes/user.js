'use stric';

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/testing-user-controller', UserController.test);
api.post('/register', UserController.saveUser);

module.exports = api;