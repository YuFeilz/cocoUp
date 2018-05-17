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
server.use(multer({ dest: './static/upload' }).any())
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
var route1 = express.Router();
var route2 = express.Router();
server.use('/artical/', route1);
route1.get('/1.html', (req, res) => {
    res.send('测试1').end();
});
route1.get('/2.html', (req, res) => {
    res.send('测试2').end();
})
server.use('/ss/', route2);
// router2.get()

// 静态文件
server.use(static('./static/'));