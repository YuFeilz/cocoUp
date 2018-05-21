const express = require('express');
const common = require('../../libs/common');
const mysql = require('mysql');

var db = mysql.createPool({ host: 'localhost', user: 'root', password: '123456', database: 'learn' });

module.exports = function() {
    var router = express.Router();
    // 进入admin页面首先要查询登录状态
    router.use((req, res, next) => {
        if (!req.session['admin_id'] && req.url != '/login') { //判断是否存在admin_id并且请求路径不是登录页的时候页面重定向到登录页面
            res.redirect('/admin/login');
        } else { //如果存在admin_id表示已经处于登录状态，继续执行下一步操作
            next();
        }
    })

    // 逻辑处理没有错误，登录到admin页面
    router.get('/', (req, res) => {
        res.render('./admin/index.ejs', {}); //渲染admin模板页面
    })

    // 路由处理
    router.use('/login', require('./login')()); //请求admin下面的login页面导航到login
    router.use('/banner', require('./banner')()); //请求路径为banner导航到banner页
    router.use('/custom', require('./custom')());
    return router;
}