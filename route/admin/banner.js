const express=require('express');
const common = require('../../libs/common');
const mysql = require('mysql');

var db = mysql.createPool({ host: 'localhost', user: 'root', password: '123456', database: 'learn' });

module.exports=function(){
    var router=express.Router();

    router.get('/', (req, res) => {
        switch(req.query.act){
            // 修改
            case 'mod':
                db.query(`SELECT * FROM banner_table WHERE ID=${req.query.id}`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('数据库错误').end();
                    }else{
                        db.query(`SELECT * FROM banner_table`,(err,banners)=>{
                            if(err){
                                console.log(err);
                                res.status(500).send('数据库错误').end();
                            }else{
                                res.render('./admin/banner.ejs', {banners:banners,mod_data:data});
                            }
                        });
                    }
                })
            break;
            // 删除
            case 'del':
                db.query(`DELETE FROM banner_table WHERE ID=${req.query.id}`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('数据库错误').end();
                    }else{
                        res.redirect('/admin/banner');
                    }
                })
            break;
            // 正常显示数据
            default:
                db.query(`SELECT * FROM banner_table`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('数据库错误').end();
                    }else{
                        res.render('./admin/banner.ejs', {banners:data});
                    }
                });
            break;
        } 
    })
    router.post('/',(req,res)=>{
        var title=req.body.title;
        var description=req.body.description;
        var href=req.body.href;
        if(!title||!description||!href){
            res.status(400).send('数据异常').end();
        }else{
            if(req.body.mod_id){ //修改
                console.log(req.body.mod_id);
                db.query(`UPDATE banner_table SET title='${req.body.title}',description='${req.body.description}',href='${req.body.href}' WHERE ID=${req.body.mod_id}`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('数据库错误').end();
                    }else{
                        res.redirect('/admin/banner');
                    }
                });
            }else{  //添加
                db.query(`INSERT INTO banner_table(title,description,href) VALUE('${title}','${description}','${href}')`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('数据库错误').end();
                    }else{
                        res.redirect('/admin/banner');
                    }
                });
            }
        }
    });
    return router;
}