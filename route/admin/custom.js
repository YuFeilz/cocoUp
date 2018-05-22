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
        switch (req.query.act) {
            case 'del':
                db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${req.query.id}`, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('数据库错误').end();
                    } else if (data.length == 0) {
                        res.status(404).send('您要的数据没找到').end();
                    } else {
                        fs.unlink('static/upload/' + data[0].src, (err, data) => {
                            if (err) {
                                console.log(err);
                                if (err.code == 'ENOENT') { //如果删除的数据没有头像只删除数据部分
                                    db.query(`DELETE FROM custom_evaluation_table WHERE ID=${req.query.id}`, (err, data) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).send('数据库错误').end();
                                        } else {
                                            res.redirect('/admin/custom');
                                        }
                                    });
                                } else {
                                    res.status(500).send('文件删除失败').end();
                                }
                            } else {
                                db.query(`DELETE FROM custom_evaluation_table WHERE ID=${req.query.id}`, (err, data) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send('数据库错误').end();
                                    } else {
                                        res.redirect('/admin/custom');
                                    }
                                });
                            }
                        });
                    }
                });
                break;
            case 'mod':
                db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${req.query.id}`, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('数据亏错误').end();
                    } else if (data.length == 0) {
                        res.status(404).send('要修改的数据不存在').end();
                    } else {
                        db.query(`SELECT * FROM custom_evaluation_table`, (err, evaluations) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send('数据库错误').end();
                            } else {
                                res.render('./admin/custom.ejs', { evaluations, mod_data: data });
                            }
                        });
                    }
                })
                break;
            default:
                db.query(`SELECT * FROM custom_evaluation_table`, (err, evaluations) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('数据库错误').end();
                    } else {
                        res.render('./admin/custom.ejs', { evaluations });
                    }
                });

                break;
        }

    })

    router.post('/', (req, res) => {
        var title = req.body.title;
        var description = req.body.description;

        if (req.files[0]) {
            var oldPAth = req.files[0].path;
            var newPath = oldPAth + pathObj.parse(req.files[0].originalname).ext; //带后缀的文件路径
            var newFile = req.files[0].filename + pathObj.parse(req.files[0].originalname).ext; //带后缀的文件名
        } else {
            var newFile = null;
        };

        if (newFile) {
            fs.rename(oldPAth, newPath, (err, data) => { //文件重命名需要带路径，数据库存储的时候只需要文件名
                if (err) {
                    res.status(500).send('文件修改错误').end();
                } else {
                    if (req.body.mod_id) { //修改
                        db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${req.body.mod_id}`, (err, data) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send('数据库错误').end();
                            } else if (data.length == 0) {
                                res.status(404).send('文件不存在').end();
                            } else {
                                fs.unlink('static/upload/' + data[0].src, (err) => {
                                    if (err) {
                                        console.error(err);
                                        res.status(500).send('文件路径错误').end();
                                    } else {
                                        db.query(`UPDATE custom_evaluation_table SET title='${title}', description='${description}', src='${newFile}' WHERE ID=${req.body.mod_id}`, (err) => {
                                            if (err) {
                                                console.error(err);
                                                res.status(500).send('数据库错误').end();
                                            } else {
                                                res.redirect('/admin/custom');
                                            }
                                        });
                                    }
                                });
                            }
                        });
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
        } else {
            if (req.body.mod_id) { //修改
                //直接改
                db.query(`UPDATE custom_evaluation_table SET title='${title}', description='${description}' WHERE ID=${req.body.mod_id}`, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('数据库错误').end();
                    } else {
                        res.redirect('/admin/custom');
                    }
                });
            } else { //添加
                db.query(`INSERT INTO custom_evaluation_table (title, description, src) VALUES('${title}', '${description}', '${newFileName}')`, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('数据库错误').end();
                    } else {
                        res.redirect('/admin/custom');
                    }
                });
            }
        }
    });
    return router;
}