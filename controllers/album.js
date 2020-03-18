'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginte = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if (err) {
            res.status(500).send({message: "🙃 Request error..!!"});
        } else {
            if (!album) {
                res.status(404).send({message: "🙃 Album not exists..!!"});
            } else {
                res.status(200).send({album});
            }
        }
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;

    if (!artistId) {
        // get all albums from DB
        var find = Album.find({}).sort('title');
    } else {
        // get albums from requested artist
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if (err) {
            res.status(500).send({message: "🙃 Request error..!!"});
        } else {
            if (!albums) {
                res.status(404).send({message: "🙃 There aren't albums..!!"});
            } else {
                res. status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({message: "🙃 Request error..!!"});
        } else {
            if (!albumStored) {
                res.status(404).send({message: "🙃 Album not saved..!!"});
            } else {
                res.status(200).send({album: albumStored});
            }
        }
    });
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({message: "🙃 Error to update album..!!"});
        } else {
            if (!albumUpdated) {
                res.status(404).send({message: "🙃 Album not updated..!!"});
            } else {
                res.status(200).send({album: albumUpdated});
            }
        }
    })
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({message: "🙃 Error to delete album..!!"});
        } else {
            if (!albumRemoved) {
                res.status(404).send({message: "🙃 Album not deleted..!!"});
            } else {
                // res.status(200).send({albumRemoved});

                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({message: "🙃 Error to delete song..!!"});
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({message: "🙃 Song not deleted..!!"});
                        } else {
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'not loaded...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if (err) {
                    res.status(504).send({message: '🙃 updating album error..!!'});
                } else {
                    if (!albumUpdated) {
                        res.status(504).send({message: "😔 album couldn't be updated..!!"});
                    } else {
                        res.status(200).send({album: albumUpdated});
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
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.status(200).sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: "🙄 Image not exists..!!"});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile,
};