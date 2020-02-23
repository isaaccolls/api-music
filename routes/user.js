'use stric';

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

api.get('/testing-user-controller', md_auth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;
