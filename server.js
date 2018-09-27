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
//导入cors模块,该模块为跨域所用
// const cors = require('cors');
// server.use(cors());
//设置跨域访问
server.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
server.use(bodyP.urlencoded());
server.use(multer({ dest: './static/upload' }).any());
server.listen(8888);

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
server.use('/admin', require('./route/admin')()); //访问admin导航到admin的主页面

// 静态文件的访问路径
server.use(static('./static'));