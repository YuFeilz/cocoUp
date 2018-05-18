const express = require('express');
module.exports = function() {
    var router = express.Router();
    router.get('/', (req, res) => {
        res.send('这是web').end();
    })
    return router;
}