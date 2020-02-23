'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: Number,
    album: { type: Schema.ObjectId, ref: 'Album'},
});

module.exports = mongoose.model('Song', SongSchema);
