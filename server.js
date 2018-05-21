const express = require('express');
const static = require('express-static');
const mysql = require('mysql');
const multer = require('multer');
const bodyP = require('body-parser');
const cookieP = require('cookie-parser');
const cookieS = require('cookie-session');
const consolidate = require('consolidate');
const expressR = require('express-route');

var server = express();
server.use(bodyP.urlencoded());
server.use(multer({ dest: './static/upload' }).any());
server.listen(8080);

// cookie session
server.use(cookieP());
(function() {
    var keys = [];
    for (var i = 0; i < 10000; i++) {
        keys[i] = 'k_' + Math.random() * 10;
    }
    server.use(cookieS({
        name: 'sess_id',
        keys: keys,
        maxAge: 20 * 60 * 1000
    }))
})();

// 模板
server.engine('html', consolidate.ejs); //使用哪个模板
server.set('views', 'template'); //设置取数据的模板目录
server.set('views engine', 'html'); //输出html时需要的东西

// 路由
server.use('/', require('./route/web')()); //访问根目录默认导航到web页
server.use('/admin', require('./route/admin/index')()); //访问admin导航到admin的主页面

// 静态文件的访问路径
server.use(static('./static'));