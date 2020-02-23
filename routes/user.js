'use stric';

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

api.get('/testing-user-controller', md_auth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-user-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-user-image/:imageFile', UserController.getImageFile);

module.exports = api;
