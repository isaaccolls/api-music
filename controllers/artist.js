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
                res.status(404).send({message: "🙃 Artist hasn't been updated..!!"});
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
                res.status(404).send({message: "🙃 Artist hasn't been deleted..!!"});
            } else {
                // res.status(200).send({artistRemoved});

                 Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({message: "🙃 Error to delete album..!!"});
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({message: "🙃 Album hasn't been deleted..!!"});
                        } else {
                            // res.status(200).send({albumRemoved});

                            Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({message: "🙃 Error to delete song..!!"});
                                } else {
                                    if (!songRemoved) {
                                        res.status(404).send({message: "🙃 Song hasn't been deleted..!!"});
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

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'not loaded...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
                if (err) {
                    res.status(504).send({message: '🙃 updating artist error..!!'});
                } else {
                    if (!artistUpdated) {
                        res.status(504).send({message: "😔 artist couldn't be updated..!!"});
                    } else {
                        res.status(200).send({artist: artistUpdated});
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
    var path_file = './uploads/artists/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.status(200).sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: "🙄 Image doesn't exist..!!"});
        }
    });
}


module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile,
};
