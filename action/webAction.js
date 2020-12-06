let dbService = require('./../service/dbService')
let async = require('async')
let cfg = require('./../conf/global')
let yhomeCfg = require('./../conf/yhomeCfg')
let weiXinSdk = require('node-weixin-media-platform-api')().init(cfg.wx)
let moment = require('moment')

let getJsjXmasExchangeItemDetail = function(itemData){
    let itemInfo = itemData

    // console.log("RAWDATA:",itemData)
    try{
        let rawData = JSON.parse(itemData.raw_data)
        itemInfo.itemName = rawData.entry[yhomeCfg.jsjItemMapping[itemData.form].itemName]
        itemInfo.itemPicUrl = rawData.entry[yhomeCfg.jsjItemMapping[itemData.form].itemPicUrl]
    }
    catch (e) {
        console.log("ERROR PARSE ORDERDATA:", itemData)
        console.log(e)
        itemInfo.itemName = ""
        itemInfo.itemPicUrl = ""
    }

    return itemInfo

}


let getJsjOrderDetail = function(orderData){
    let orderInfo = orderData

    // console.log("RAWDATA:",orderData)
    try{
        let rawData = JSON.parse(orderData.raw_data)
        // console.log("RAWDATA PARSED:",rawData)
        // console.log(jsjItemMapping[orderData.form].items)
        // console.log(jsjItemMapping[orderData.form].contactName)
        // console.log(jsjItemMapping[orderData.form].contactMobile)
        // console.log(jsjItemMapping[orderData.form].pickupLocation)

        orderInfo.orderItems = rawData.entry[yhomeCfg.jsjItemMapping[orderData.form].items]
        orderInfo.contactName = rawData.entry[yhomeCfg.jsjItemMapping[orderData.form].contactName]
        orderInfo.contactMobile = rawData.entry[yhomeCfg.jsjItemMapping[orderData.form].contactMobile]
        orderInfo.pickupLocation = rawData.entry[yhomeCfg.jsjItemMapping[orderData.form].pickupLocation]
    }
    catch (e) {
        console.log("ERROR PARSE ORDERDATA:", orderData)
        orderInfo.orderItems = []
        orderInfo.contactName = ""
        orderInfo.contactMobile = ""
        orderInfo.pickupLocation = ""
    }
    // 订单状态中文
    orderInfo.orderStatusDesc = yhomeCfg.mapOrderStatus[orderData.order_status] || "未知"


    return orderInfo
}

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

exports.yHomeAdminAuth = function(req, res, next){
    if(req.session.openId){
        dbService.get_user_info(req.session.openId, function(results){
            console.log("RESULSTS", results)
            if(results && results.openId && results.isAdmin){
                console.log('admin info:', results)
                next()
            }
            else{
                console.log('invalid weixin openid')
                res.render('unauth', {errMessage: "未认证的微信用户，请联系管理员..."})
            }
        })
    }
    else{
        console.log('access not from weixin client, go to error...')
        res.render('unauth', {errMessage: "请从微信客户端访问..."})
    }
}

exports.insertJSJ = function(req, res){
    let formType = req.query.form_type || ''
    let rawData = req.body
    console.log(formType)
    // console.log(JSON.stringify(rawData))
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

exports.renderXmasActivityItems = function(req, res){
    res.render('xmasActivityItems')
}

exports.getXmasActivityItems = function(req, res){
    // minId为页面列表中当前显示的最小的id，后端需要取比这个小的 pageSize 个
    let minId = parseInt(req.query.min_id) || -1
    let pageSize = parseInt(req.query.page_size) || 5
    let items = []
    // console.log("minId",minId)
    // console.log("pageSize",pageSize)
    dbService.getXmasActivityItems(minId, pageSize, function(data){
        if(data){
            for(let i=0; i<data.length; i++){
                let item = getJsjXmasExchangeItemDetail(data[i])
                delete item.raw_data
                items.push(item)
            }
        }
        res.json({"items":items})
    })
}

// ********************************************************
//                管理相关的请求放在下面
// ********************************************************
exports.renderAdminOnlineOrders = function(req, res){
    res.render('admin/mOnlineOrders')
}

exports.getAdminOrders = function(req, res){
    let page     = req.query.page||1;//默认从第一页开始查询
    let pageSize = parseInt(req.query.pageSize)||5;//TODO:把这个配置到conf文件中，现在写死为10
    let mobile = req.query.mobile
    let genCode = req.query.genCode

    let param = {
        "page": page,
        "pageSize": pageSize,
        "mobile": mobile,
        "genCode": genCode
    }

    dbService.getAdminOnlineOrders(param, function(error, results){
        if (error) {
            res.json({error: "DB_ERROR", errorMsg: error});
        } else {
            let orders = []

            for(let i=0; i<results.orders.length; i++){
                let orderInfo = getJsjOrderDetail(results.orders[i])
                delete orderInfo.raw_data
                orders.push(orderInfo)
            }

            res.json({error: 200, errorMsg: "", data: orders,page:page,totalPage:Math.ceil(parseFloat(results.ordersCount)/pageSize),totalRecords:results.ordersCount});
        }
    })
}


exports.renderAdminOnlineOrder = function(req, res){
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

            res.render('admin/mOnlineOrder', orderInfo)
        }
        else{
            res.render('yError',{title:"系统异常", message:"没找到对应的订单信息~"})
        }
    })
}

exports.orderUpdate = function(req, res){
    let orderInfo = req.body
    if(parseInt(orderInfo.id)){
        dbService.updateOnlineOrder(orderInfo,function(err){
            res.json(err);
        })
    }
    else{
        res.json({"errorCode":-1,"errorMsg":"更新订单状态时传入的参数不对"});
    }
}

