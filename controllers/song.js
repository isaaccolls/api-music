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

function getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist',
        }
    }).exec(function(err, songs) {
        if (err) {
            res.status(500).send({message: "🙃 Request error..!!"})
        } else {
            if (!songs) {
                res.status(404).send({message: "🙃 Album doesn't have songs..!!"});
            } else {
                res.status(200).send({songs});
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
            res.status(500).send({message: "🙃 Error saving song..!!"});
        } else {
            if (!songStored) {
                res.status(404).send({message: "🙃 Song not saved..!!"});
            } else {
                res.status(200).send({song: songStored});
            }
        }
    });
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({message: "🙃 Error updating song..!!"});
        } else {
            if (!songUpdated) {
                res.status(404).send({message: "🙃 Song not updated..!!"});
            } else {
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({message: "🙃 Error deleting song..!!"});
        } else {
            if (!songRemoved) {
                res.status(404).send({message: "🙃 Song not removed..!!"});
            } else {
                res.status(200).send({song: songRemoved});
            }
        }
    });
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'not loaded...';

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'mp3' || file_ext == 'ogg') {
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if (err) {
                    res.status(504).send({message: '🙃 error updating song..!!'});
                } else {
                    if (!songUpdated) {
                        res.status(504).send({message: "😔 song couldn't be updated..!!"});
                    } else {
                        res.status(200).send({song: songUpdated});
                    }
                }
            });
        } else {
            res.status(200).send({message: '🙈 Not valid file extension..!!'});
        }
    } else {
        res.status(200).send({message: '🙄 Missing file..!!'});
    }
}

function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.status(200).sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: "🙄 audio file not exists..!!"});
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile,
};