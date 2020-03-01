'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginte = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({message: "🙃 Request error..!!"});
        } else {
            if (!artist) {
                res.status(404).send({message: "🙃 Artist doesn't exist..!!"});
            } else {
                res.status(200).send({artist});
            }
        }
    });
}

function getArtists(req, res) {
    var page = req.params.page ? req.params.page : 1;
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total) {
        if (err) {
            res.status(500).send({message: "🙃 Request error..!!"});
        } else {
            if (!artists) {
                res.status(404).send({message: "🙃 There aren't artists..!!"});
            } else {
                return res.status(200).send({
                    total_items: total,
                    artists,
                });
            }
        }
    });
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({message: "🙃 Error to update artist..!!"});
        } else {
            if (!artistUpdated) {
                res.status(404).send({message: "🙃 Artist haven't been updated..!!"});
            } else {
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({message: "🙃 Error to delete artist..!!"});
        } else {
            if (!artistRemoved) {
                res.status(404).send({message: "🙃 Artist haven't been deleted..!!"});
            } else {
                // res.status(200).send({artistRemoved});

                 Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({message: "🙃 Error to delete album..!!"});
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({message: "🙃 Album haven't been deleted..!!"});
                        } else {
                            // res.status(200).send({albumRemoved});

                            Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({message: "🙃 Error to delete song..!!"});
                                } else {
                                    if (!songRemoved) {
                                        res.status(404).send({message: "🙃 Song haven't been deleted..!!"});
                                    } else {
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({message: "🙃 Saving artist error..!!"});
        } else {
            if (!artistStored) {
                res.status(404).send({message: "🙃 Artist doesn't saved..!!"});
            } else {
                res.status(200).send({artist: artistStored});
            }
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
};
