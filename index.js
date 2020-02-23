'user strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("👽 DB connected..!!");
        app.listen(port, function() {
            console.log("👽 API Music Server running..!!\n👽 Port: " + port);
        });
    }
});