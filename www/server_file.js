const express = require('express');
const bodyP = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

var multerObj = multer({ dest: './upload/' });
var server = express();
// server.use(bodyP.urlencoded({ extended: false }));
// server.use('/', function(req, res, next) {
//     console.log(req.body);
// })

server.use(multerObj.any());
server.post('/', function(req, res) {
    // console.log(req.files[0]);
    var newName = req.files[0].path + path.parse(req.files[0].originalname).ext;
    fs.rename(req.files[0].path, newName, function(err) {
        if (err) {
            res.send('错了');

        } else {
            res.send('成了');
        }
    })
})

server.listen(8080);