'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginte = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if (err) {
            res.status(500).send({message: "🙃 Request error..!!"})
        } else {
            if (!song) {
                res.status(404).send({message: "🙃 Song not exists..!!"});
            } else {
                res.status(200).send({song});
            }
        }
    });
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({message: "🙃 Error when saving song..!!"});
        } else {
            if (!songStored) {
                res.status(404).send({message: "🙃 Song not saved..!!"});
            } else {
                res.status(200).send({song: songStored});
            }
        }
    });
}

module.exports = {
    getSong,
    saveSong,
};