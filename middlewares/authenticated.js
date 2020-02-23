'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'super-secret-key';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message: '🙃 Missing auth header..!!'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: '🙈 Expired token..!!'});
        }
    } catch(ex) {
        console.log("🙃 ex: ",ex);
        return res.status(400).send({message: "🙃 Token not valid..!!"});
    }

    req.user = payload;
    next();
};
