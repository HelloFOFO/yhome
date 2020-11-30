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

exports.jsjOnlineOrderFeedback = function(req, res){
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

        dbService.getJSJOnlineOrderID(param, function(data){
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
    let openId = req.session.openId
    dbService.getMyOnlineOrders(openId, function(data){

        if(data){
            let orders = []

            for(let i=0; i<data.length; i++){
                let orderInfo = getJsjOrderDetail(data[i])
                delete orderInfo.raw_data
                orders.push(orderInfo)
            }

            // console.log("MyOrders:", orders)
            res.render('mMyOnlineOrders', {"orders": orders})
        }
        else{
            res.render('yError',{title:"系统异常", message:"没有找到您的订单~"})
        }
    })
}

exports.renderOnlineOrder = function(req, res){
    let orderId = req.params.id
    // res.send("订单详情页:"+orderId.toString())

    dbService.getOnlineOrderInfo(orderId, function(data){
        if(data){
            // 这儿需要对raw_data里的field开头的内容进行处理，翻译成具体的字段名称；
            // 这样前端就不需要改动了

            let orderInfo = getJsjOrderDetail(data)
            // console.log("ORDERINFO PARSED:", orderInfo)

            // 最后删掉不需要的属性
            delete orderInfo.raw_data

            res.render('mOnlineOrder', orderInfo)
        }
        else{
            res.render('yError',{title:"系统异常", message:"没找到对应的订单信息~"})
        }
    })
}

let getJsjOrderDetail = function(orderData){
    let orderInfo = orderData
    let jsjItemMapping = {
        "XpjHqw":{
            "items": "field_1",
            "contactName": "field_2",
            "contactMobile": "field_3",
            "pickupLocation": "field_6",
        }
    }
    // console.log("RAWDATA:",orderData)
    try{
        let rawData = JSON.parse(orderData.raw_data)
        // console.log("RAWDATA PARSED:",rawData)
        // console.log(jsjItemMapping[orderData.form].items)
        // console.log(jsjItemMapping[orderData.form].contactName)
        // console.log(jsjItemMapping[orderData.form].contactMobile)
        // console.log(jsjItemMapping[orderData.form].pickupLocation)

        orderInfo.orderItems = rawData.entry[jsjItemMapping[orderData.form].items]
        orderInfo.contactName = rawData.entry[jsjItemMapping[orderData.form].contactName]
        orderInfo.contactMobile = rawData.entry[jsjItemMapping[orderData.form].contactMobile]
        orderInfo.pickupLocation = rawData.entry[jsjItemMapping[orderData.form].pickupLocation]
    }
    catch (e) {
        console.log("ERROR PARSE ORDERDATA:", orderData)
        orderInfo.orderItems = []
        orderInfo.contactName = ""
        orderInfo.contactMobile = ""
        orderInfo.pickupLocation = ""
    }


    return orderInfo
}