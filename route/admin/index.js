const express = require('express');
const common = require('../../libs/common');
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

    // 逻辑处理没有错误，登录到admin页面
    router.get('/', (req, res) => {
        res.render('./admin/index.ejs', {});
    })

    router.use('/login',require('./login')());
    router.use('/banner',require('./banner')());
    return router;
}