let dbService = require('./../service/dbService')
let async = require('async')
let cfg = require('./../conf/global')
let weiXinSdk = require('node-weixin-media-platform-api')().init(cfg.wx)
let moment = require('moment')

exports.wxAuth = function(req, res, next){
    if(cfg.debug){
        console.log('debug model...')
        req.session.openId = cfg.openId
        next()
    }
    else{
        console.log('begin weixin auth...')
        weiXinSdk.auth(req, res, next)
        // next()  // 直接next，模拟微信认证通过；
    }
}

exports.renderIndex = function(req, res){
    if(req.session.openId){
        res.redirect('/abb_main.html')
    }
    else{
        res.json('bad access')
    }
}




