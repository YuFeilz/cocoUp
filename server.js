const express = require('express');
const static = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyP = require('body-parser'); //只能读取数据类请求不能读取文件
const multer = require('multer');
const consolidate = require('consolidate'); //模板引擎整合库
const mysql = require('mysql');
const common = require('./libs/common');

var server = express();
var db = mysql.createPool({ host: 'localhost', user: 'root', password: '654321', database: 'blog' })
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
server.use(multer({ dest: './www/upload' }).any());

// 4.配置模板引擎
// set对server全局的配置
// 4.3.输出什么东西
server.set('view engine', 'html');
// 4.2.模板文件放在哪里
server.set('views', './template');
// 4.1.用那种模板引擎
server.engine('html', consolidate.ejs);
// 5.接受用户请求
server.get('/', (req, res, next) => {
    db.query("SELECT * FROM `banner_table`", (err, data) => {
        if (err) {
            res.status(500).send('database error:' + err).end();
        } else {
            res.banners = data;
            next();
        }
    })
})
server.get('/', (req, res, next) => {
    // 查询列表
    db.query("SELECT ID,title,summary FROM artical_table", (err, data) => {
        if (err) {
            res.status(500).send('database error' + err).end();
        } else {
            res.news = data;
            next();
        }
    })
})
server.get('/', (req, res) => {
    res.render('index.ejs', { banners: res.banners, news: res.news });
})
server.get('/artical', (req, res) => {
    if (req.query.id) {
        if (req.query.link == 'like') {
            // 增加一条赞
            db.query(`UPDATE artical_table SET n_like=n_like+1 WHERE ID=${req.query.id}`, (err, data) => {
                if (err) {
                    res.status(500).send('服务器出错啦').end();
                    console.log(err);
                } else {
                    // 查询数据
                    db.query(`SELECT * FROM artical_table WHERE ID=${req.query.id}`, (err, data) => {
                        if (err) {
                            res.status(500).send('数据库错误' + err).end();
                        } else {
                            if (data.length == 0) {
                                res.status(404).send('博文不存在').end();
                            } else {
                                var articaldata = data[0];
                                articaldata.sDate = common.timeDate(articaldata.post_time);
                                res.render('conText.ejs', { artical_data: articaldata });
                            }
                        }
                    });
                }
            })
        } else {
            db.query(`SELECT * FROM artical_table WHERE ID=${req.query.id}`, (err, data) => {
                if (err) {
                    res.status(500).send('数据库错误' + err).end();
                } else {
                    if (data.length == 0) {
                        res.status(404).send('博文不存在').end();
                    } else {
                        var articaldata = data[0];
                        articaldata.sDate = common.timeDate(articaldata.post_time);
                        res.render('conText.ejs', { artical_data: articaldata });
                    }
                }
            })
        }
    } else {
        res.status(404).send('博文未找到').end();
    }

})

// 6.静态数据
server.use(static('./www'));
server.listen(8080);