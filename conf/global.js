
var debug = require('./.debug');

//数据库配置
var db = {};
if(debug){
    //非生产环境
    db.slaveHost = process.env.db_slaveHost||'106.14.10.98';
    db.host      = process.env.db_host||'106.14.10.98';
    db.user      = 'sow';
    db.password  = '90op()OP';
    db.database  = 'yhome';
}else{
    //生产环境
    db.slaveHost = '127.0.0.1';
    db.host      = '127.0.0.1';
    db.user      = 'sow';
    db.password  = '90op()OP';
    db.database  = 'yhome';
}

var wx = {}
if(debug){
    wx = {
        appId: "wxf6e1ef44ca9690de",
        appSecret: "2c82096d96028b67f591bbf3273efd19",
        wxHost: "api.weixin.qq.com",
        wxPort: 443,
        domain: 'https://api.weixin.qq.com',
        token: "irobot"
    }
}
else{
    wx = {
        appId: "wx17514164c85fe9e0",
        appSecret: "1db09a56b26a08ccff5fb2d8d4389f98",
        wxHost: "api.weixin.qq.com",
        wxPort: 443,
        domain: 'https://api.weixin.qq.com',
        token: "irobot"
    }
}

module.exports = {db:db, wx:wx, nbq_bl: 10, debug: debug, openId: "ABB"};
