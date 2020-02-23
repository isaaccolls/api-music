'use strict';

function test(req, res) {
    res.status('200').send({
        message: 'testing user controller',
    });
}

module.exports = {
    test,
};
