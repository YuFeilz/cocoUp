const express = require('express');
const mysql = require('mysql');
const common = require('../../libs/common');
const pathObj = require('path');
const fs = require('fs');

// 创建数据库
var db = mysql.createPool({ host: 'localhost', user: 'root', password: '123456', database: 'learn' });

module.exports = function() {
    var router = express.Router();
    router.get('/', (req, res) => {
        db.query(`SELECT * FROM custom_evaluation_table`, (err, evaluations) => {
            if (err) {
                console.log(err);
                res.status(500).send('数据库错误').end();
            } else {
                res.render('./admin/custom.ejs', { evaluations });
            }
        });
    })

    router.post('/', (req, res) => {
        var title = req.body.title;
        var description = req.body.description;
        var oldPAth = req.files[0].path;
        var newPath = oldPAth + pathObj.parse(req.files[0].originalname).ext; //带后缀的文件路径
        var newFile = req.files[0].filename + pathObj.parse(req.files[0].originalname).ext; //带后缀的文件名

        fs.rename(oldPAth, newPath, (err, data) => { //文件重命名需要带路径，数据库存储的时候只需要文件名
            if (err) {
                res.status(500).send('文件修改错误').end();
            } else {
                if (req.body.mod_id) { //修改
                    // db.query(`UPDATE custom_evaluation_table SET () VALUES('','','')`, (err, data) = {

                    // })
                } else { //添加
                    db.query(`INSERT INTO custom_evaluation_table (title,description,src) VALUES('${title}','${description}','${newFile}')`, (err, custom) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('数据库错误').end();
                        } else {
                            res.redirect('/admin/custom');
                        }
                    })
                }
            }
        })


    })
    return router;
}