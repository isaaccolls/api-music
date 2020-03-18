'use strict';

var express = require('express');
var SongController = require('../controllers/song');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' });

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);

module.exports = api;
