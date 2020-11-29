let dbService = require('./../service/dbService')
let async = require('async')
let cfg = require('./../conf/global')
let weiXinSdk = require('node-weixin-media-platform-api')().init(cfg.wx)
let moment = require('moment')

exports.wxAuth = function(req, res, next){
    console.log('begin weixin auth...')
    weiXinSdk.auth(req, res, next)
    // if(cfg.debug){
    //     console.log('debug model...')
    //     req.session.openId = cfg.openId
    //     next()
    // }
    // else{
    //     console.log('begin weixin auth...')
    //     weiXinSdk.auth(req, res, next)
    //     // next()  // 直接next，模拟微信认证通过；
    // }
}

exports.yHomeAuth = function(req, res, next){
    if(req.session.openId){
        // console.log(req.session.openId)
        next()
    }
    else{
        console.log('access not from weixin client, go to error...')
        res.render('unauth', {errMessage: "请从微信客户端访问..."})
    }
}

exports.insertJSJ = function(req, res){
    let formType = req.query.form_type || ''
    let rawData = req.body
    dbService.insertJSJ(formType, rawData, function(err){
        if(err) {
            console.log(err)
        }
        res.json({"errorCode":200,"errorMsg":null,"data":null});
    })
}

exports.jsjFeedback = function(req, res){
    let genCode = req.query.gen_code
    let serialNumber = req.query.serial_number
    let openId = req.session.openId

    console.log("genCode:",genCode);
    console.log("serialNumber",serialNumber);
    console.log("openId",openId);

    if(genCode && serialNumber && openId){
        let param = {
            openId: openId,
            genCode: genCode,
            serialNumber: serialNumber
        }

        dbService.getJSJOnlineOrder(param, function(data){
            if(data && data.length == 1){
                res.redirect('/onlinemarket/order/'+data[0].id)
            }
            else{
                res.render('yError',{title:"系统异常", message:"请点击右上角【...】刷新后重试"})
            }
            //res.render('myorders', {orders:data})
        })
    }
    else {
        res.render('yError',{title:"系统异常", message:"请返回【公众号-我的订单】查看"})
    }
}

exports.renderMyOnlineOrders = function(req, res){
    res.send("订单列表页:")
}

exports.renderOnlineOrder = function(req, res){
    let orderId = req.params.id
    res.send("订单详情页:"+orderId.toString())
}