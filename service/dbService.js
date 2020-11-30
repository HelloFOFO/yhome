var pool        = require('./../libs/dbpool');
var async       = require('async');

//只有接口里会用到的函数，为了写sql方便，不用拼字符串
var heredoc = function(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
};

// exports.update_error_status = function(ioa, min_error_id, max_error_id, cb){
//     console.log('update error status for ioa-%s from %d to %d',ioa, min_error_id, max_error_id )
//     async.auto({
//             doUpdate: function (cb1) {
//                 pool.getReadOnlyConnection(function(error,conn) {
//                     if (error) {
//                         console.log("db connect error");
//                         cb1("error_db_connect", null);
//                     }
//                     else {
//                         let sql = heredoc( function () {/*
//                              UPDATE log_monitor_error SET send_wx_msg = 1 WHERE ioa = ? AND id BETWEEN ? AND ?;
//                              */});
//                         let sqlParams = [ioa, min_error_id, max_error_id]
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
//                 cb({"errorCode":-1,"errorMsg":'更新错误状态失败'});
//             }
//             else{
//                 cb(null);
//             }
//         }
//     );
// }

// 用于接收金数据的表单信息
exports.insertJSJ = function(formType, rawData, cb){
    // console.log(JSON.stringify(rawData))

    let raw_data = JSON.stringify(rawData)
    let form = rawData.form
    let form_name = rawData.form_name
    let serial_number = rawData.entry.serial_number || -1
    let total_price = rawData.entry.total_price || -1
    let preferential_price = rawData.entry.preferential_price || -1
    let trade_no = rawData.entry.trade_no || -1
    let trade_status = rawData.entry.trade_status || ''
    let payment_method = rawData.entry.payment_method || ''
    let gen_code = rawData.entry.gen_code || ''
    let x_field_weixin_openid = rawData.entry.x_field_weixin_openid || ''
    let x_field_weixin_headimgurl = rawData.entry.x_field_weixin_headimgurl || ''
    let x_field_weixin_nickname = rawData.entry.x_field_weixin_nickname || ''
    let x_field_weixin_gender = rawData.entry.x_field_weixin_gender || ''
    let x_field_weixin_province = rawData.entry.x_field_weixin_province_city.province || ''
    let x_field_weixin_city = rawData.entry.x_field_weixin_province_city.city || ''
    let creator_name = rawData.entry.creator_name || ''
    let created_at = rawData.entry.created_at || null
    let updated_at = rawData.entry.updated_at || null
    let info_remote_ip = rawData.entry.info_remote_ip || ''


    async.auto({
            insertDB:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         INSERT INTO form_jsj(form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status,payment_method,gen_code
                                    ,x_field_weixin_openid,x_field_weixin_headimgurl
                                    ,x_field_weixin_nickname,x_field_weixin_gender,x_field_weixin_province,x_field_weixin_city
                                    ,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt)
                         VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW());
                         */});
                        let sqlParam = []

                        sqlParam.push(formType)
                        sqlParam.push(raw_data)
                        sqlParam.push(form)
                        sqlParam.push(form_name)
                        sqlParam.push(serial_number)
                        sqlParam.push(total_price)
                        sqlParam.push(preferential_price)
                        sqlParam.push(trade_no)
                        sqlParam.push(trade_status)
                        sqlParam.push(payment_method)
                        sqlParam.push(gen_code)
                        sqlParam.push(x_field_weixin_openid)
                        sqlParam.push(x_field_weixin_headimgurl)
                        sqlParam.push(x_field_weixin_nickname)
                        sqlParam.push(x_field_weixin_gender)
                        sqlParam.push(x_field_weixin_province)
                        sqlParam.push(x_field_weixin_city)
                        sqlParam.push(creator_name)
                        sqlParam.push(created_at)
                        sqlParam.push(updated_at)
                        sqlParam.push(info_remote_ip)

                        conn.query(sql, sqlParam, function (error) {
                            conn.release();
                            if (error) {
                                cb1("error_db_query");
                            } else {
                                cb(null);
                            }
                        });
                    }
                });
            }
        },function(err){
            if (err) {
                console.log(err)
                cb({"errorCode":-1,"errorMsg":'接收表单信息失败'});
            } else {
                cb(null);
            }
        }
    );
}

// 获取金数据提交后的订单ID
exports.getJSJOnlineOrderID = function(param, cb){
    console.log("QUERY_PARAMS: ",JSON.stringify(param))

    let openId = param.openId
    let serialNumber = param.serialNumber
    let genCode = param.genCode

    async.auto({
            orders:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id
                         FROM   form_jsj
                         WHERE  form_type = 'ONLINEORDER'
                         */});

                        let sqlParam = []

                        // if(openId){
                        //     sql += ' AND x_field_weixin_openid = ?'
                        //     sqlParam.push(openId)
                        // }
                        if(serialNumber){
                            sql += ' AND serial_number = ?'
                            sqlParam.push(serialNumber)
                        }
                        if(genCode){
                            sql += ' AND gen_code = ?'
                            sqlParam.push(genCode)
                        }

                        conn.query(sql, sqlParam, function (error, results) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", []);
                            } else {
                                console.log("DB_RESULTS:", results)
                                cb1(null, results);
                            }
                        });
                    }
                });
            }
        },function(err,results){
            if (err) {
                console.log("ERROR_FUNCTION:", err)
                cb([]);
            } else {
                console.log("RESULTS:", results)
                cb(results.orders);
            }
        }
    );
}

exports.getOnlineOrderInfo = function(orderId, cb){
    console.log("QUERY_OrderID: ", orderId)
    async.auto({
            order:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                         FROM   form_jsj
                         WHERE  form_type = 'ONLINEORDER' AND id = ?
                         */});

                        let sqlParam = []
                        sqlParam.push(orderId)

                        conn.query(sql, sqlParam, function (error, result) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
                                console.log("DB_RESULTS:", result)
                                if( result.length == 1){
                                    cb1(null, result[0]);
                                }
                                else{
                                    cb1("more than one row found", null);
                                }
                            }
                        });
                    }
                });
            }
        },function(err,results){
            if (err) {
                console.log("ERROR_FUNCTION:", err)
                cb(null);
            } else {
                console.log("RESULTS:", results)
                cb(results.order);
            }
        }
    );
}