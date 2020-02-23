'user strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/music_db', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("👽 DB connected..!!");
        app.listen(port, function() {
            console.log("👽 API Music Server running..!!\n👽 Port: " + port);
        });
    }
});