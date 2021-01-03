let pool   = require('./../libs/dbpool');
let async  = require('async');
let moment = require('moment');
let yhomeCfg = require('./../conf/yhomeCfg')
let dbService = require('./../service/dbService')


//只有接口里会用到的函数，为了写sql方便，不用拼字符串
let heredoc = function(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
};

let getJsjOrderDetail = function(formJsjData){
    let orderInfo = formJsjData

    // console.log("RAWDATA:",orderData)
    try{
        let rawData = JSON.parse(formJsjData.raw_data)
        // console.log("RAWDATA PARSED:",rawData)
        // console.log(jsjItemMapping[orderData.form].items)
        // console.log(jsjItemMapping[orderData.form].contactName)
        // console.log(jsjItemMapping[orderData.form].contactMobile)
        // console.log(jsjItemMapping[orderData.form].pickupLocation)
        // console.log(rawData)

        orderInfo.orderItems = rawData.entry[yhomeCfg.jsjItemMapping[formJsjData.form].items]
        orderInfo.contactName = rawData.entry[yhomeCfg.jsjItemMapping[formJsjData.form].contactName]
        orderInfo.contactMobile = rawData.entry[yhomeCfg.jsjItemMapping[formJsjData.form].contactMobile]
        orderInfo.pickupLocation = rawData.entry[yhomeCfg.jsjItemMapping[formJsjData.form].pickupLocation]
        orderInfo.rec_code = rawData.entry[yhomeCfg.jsjItemMapping[formJsjData.form].recCode]
    }
    catch (e) {
        console.log(e)
        console.log("ERROR PARSE ORDERDATA:", formJsjData)
        orderInfo.orderItems = []
        orderInfo.contactName = ""
        orderInfo.contactMobile = ""
        orderInfo.pickupLocation = ""
        orderInfo.rec_code = -1
    }
    // console.log(orderInfo)
    return orderInfo
}


let transfer_from_jsj_to_order = function(formInfo, cb){
    let orderInfo = getJsjOrderDetail(formInfo)

    dbService.insert_ord_order(orderInfo, function(err){
        if(err){
            console.log('插入ord_orders表失败，原始ID是：', orderInfo.id)
        }
        // 上面把有问题的formInfo记录下来，用于后面的人工处理；函数永远都返回null，
        cb(null)
    })

}

exports.insert_ord_orders = function(cb){
    dbService.get_latest_orders_from_form_jsj(function(orders){
        console.log("TOTALS ORDERS TO BE INSERTED:", orders.length)
        async.each(orders, transfer_from_jsj_to_order, function (err) {
            if(err){
                console.log("ORDERS INSERTED FAILED", err)
                cb({"errCode": -1, "errMsg": err})
            }
            else{
                console.log("ORDERS INSERTED SUCCEEDED~")
                cb({"errCode": 200, "errMsg": orders.length.toString() +" orders inserted"})
            }
        })
    })
}

// exports.backup_di_data = function () {
//     async.auto({
//             do_update: function (cb1) {
//                 pool.getReadOnlyConnection(function(error,conn) {
//                     if (error) {
//                         console.log("db connect error");
//                         cb1("error_db_connect", null);
//                     }
//                     else {
//                         var cal_dt = moment().add(-2, 'days').format('YYYY-MM-DD');
//                         var sqlParams = [cal_dt]
//                         var sql = heredoc( function () {/*
//                          CALL sp_backup_di_data(?)
//                          */});
//                         console.log(sql, sqlParams)
//                         conn.query( sql, sqlParams, function(err){
//                             conn.release();
//                             if(err){
//                                 console.log("db query error");
//                                 cb1("error_db_query");
//                             }
//                             else{
//                                 cb1(null);
//                             }
//                         });
//
//                     }
//                 });
//             }
//         },function(err){
//             if(err){
//                 console.log(err)
//             }
//         }
//     );
// }

