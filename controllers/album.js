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
                res.status(404).send({message: "🙃 Album doesn't exist..!!"});
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
                res.status(404).send({message: "🙃 Album doesn't saved..!!"});
            } else {
                res.status(200).send({album: albumStored});
            }
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
};