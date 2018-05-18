const express = require('express');
const common = require('../libs/common');
const mysql = require('mysql');

var db = mysql.createPool({ host: 'localhost', user: 'root', password: '123456', database: 'learn' });

module.exports = function() {
    var router = express.Router();
    // 查询登录状态
    router.use((req, res, next) => {
        if (!req.session['admin_id'] && req.url != '/login') {
            res.redirect('/admin/login');
        } else {
            next();
        }
    })

    // 处理用户登录
    // 如果是get请求不做任何处理，直接显示到登录页面
    router.get('/login', (req, res) => {
        res.render('./admin/login.ejs', {});
    })

    // 如果是post请求判断用户名密码验证处理
    router.post('/login', (req, res) => {
        var username = "'" + req.body.username + "'";
        var password = common.md5(req.body.password + common.MD5_SUFFIX);

        db.query(`SELECT * FROM admin_table WHERE username="yufei"`, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send('数据库错误').end();
            } else {
                if (data.length == 0) {
                    res.status(400).send('用户名不存在').end();
                } else {
                    if (data[0].password == password) {
                        req.session['admin_id'] = data[0].ID;
                        res.redirect('/admin');
                    } else {
                        res.status(400).send('密码错误').end();
                    }
                }
            }
        })
    })

    // 逻辑处理没有错误，登录到admin页面
    router.get('/', (req, res) => {
        res.render('./admin/index.ejs', {});
    })
    router.get('/banner', (req, res) => {
        res.render('./admin/banner.ejs', {});
    })
    return router;
}