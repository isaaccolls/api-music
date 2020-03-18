'use strict';

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function test(req, res) {
    res.status('200').send({
        message: 'testing user controller',
    });
}

function saveUser(req, res) {
    var user = new User();

    var params = req.body;
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        // encrypt password and save data
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                // save user
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({message: '🙃 Error saving user'});
                    } else {
                        if (!userStored) {
                            res.status(404).send({message: '🙃 User not saved'});
                        } else {
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            } else {
                res.status(200).send({ message: '🙃 Data missing..!!'});
            }
        });
    } else {
        res.status(200).send({ message: '🙃 Password missing..!!'});
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({message: '🙃 Request error..!!'});
        } else {
            if (!user) {
                res.status(404).send({message: "🙈 User doesn't exist"});
            } else {
                // check password! 👽
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        // return user data
                        if (params.getHash) {
                            // return JWT 👽
                            res.status(200).send({
                                token: jwt.createToken({user}),
                            });
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: "🙈 User can't log in"});
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(504).send({message: '🙃 Updating user error..!!'});
        } else {
            if (!userUpdated) {
                res.status(504).send({message: "😔 user couldn't be updated..!!"});
            } else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'not loaded...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if (err) {
                    res.status(504).send({message: '🙃 Updating user error..!!'});
                } else {
                    if (!userUpdated) {
                        res.status(504).send({message: "😔 user couldn't be updated..!!"});
                    } else {
                        res.status(200).send({image: file_name, user: userUpdated});
                    }
                }
            });
        } else {
            res.status(200).send({message: '🙈 Not valid file extension..!!'});
        }
    } else {
        res.status(200).send({message: '🙄 Missing image..!!'});
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.status(200).sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: "🙄 Image doesn't exist..!!"});
        }
    });
}

module.exports = {
    test,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,
};
