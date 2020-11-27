
var debug = require('./.debug');

//数据库配置
var db = {};
if(debug){
    //非生产环境
    db.slaveHost = process.env.db_slaveHost||'127.0.0.1';
    db.host      = process.env.db_host||'127.0.0.1';
    db.user      = 'abb';
    db.password  = '90op()OPabb';
    db.database  = 'ice104';
}else{
    //生产环境
    db.slaveHost = '127.0.0.1';
    db.host      = '127.0.0.1';
    db.user      = 'root';
    db.password  = 'iec104';
    db.database  = 'iec104';
}

var wx = {}
wx = {
    appId: "wxec41a645728e9c10",
    appSecret: "e9a82f49a866bf57d4caea9f7d89e33c",
    wxHost: "api.weixin.qq.com",
    wxPort: 443,
    domain: 'https://api.weixin.qq.com',
    token: "irobot",
    mchId: "1490677542",
    partnerKey: "dd98e72a20d07053a1f49d0g0e7c4450",
    payNotifyUrl: "http://irobot.zhongzhengtx.com/iRobot/wx/payNotify"
}

module.exports = {db:db, wx:wx, nbq_bl: 10, debug: debug, openId: "ABB"};
