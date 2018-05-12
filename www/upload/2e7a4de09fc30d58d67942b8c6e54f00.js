const express = require('express');
const static = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyP = require('body-parser'); //只能读取数据类请求不能读取文件
const jade = require('jade');

var server = express();
// 1.解析cookie
server.use(cookieParser('dfdfsdfgsdfgsd'));
// 2.使用session
var arr = [];
for (var i = 0; i < 10000; i++) {
    arr.push('keys' + Math.floor(Math.random() * 10));
}
server.use(cookieSession({ name: 'sees_id', keys: arr, maxAge: 20 * 60 * 60 * 100 }));
// 3.接受post请求
server.use(bodyP.urlencoded({ extended: false }));
// 4.用户请求
server.use('/', function(req, res, next) {
    console.log(req.query, req.body, req.cookies, req.session);
})

// 5.静态数据
server.use(static('./www'));
server.listen(8080);