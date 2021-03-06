let pool        = require('./../libs/dbpool');
let async       = require('async');
let _           = require('underscore');
let moment      = require('moment')

//只有接口里会用到的函数，为了写sql方便，不用拼字符串
let heredoc = function(fn) {
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

exports.get_user_info = function(openId, cb){
    let userInfo = {
        "openId": openId,
        "isAdmin": true
    }
    //TODO: 增加数据库验证用户信息
    cb(userInfo)
}

// 用于接收金数据的表单信息
exports.insertJSJ = function(formType, rawData, cb){
    // console.log(JSON.stringify(rawData))
    try{

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
        let x_field_weixin_province = rawData.entry.x_field_weixin_province_city ? rawData.entry.x_field_weixin_province_city.province || '': ''
        let x_field_weixin_city = rawData.entry.x_field_weixin_province_city ? rawData.entry.x_field_weixin_province_city.city || '': ''
        let creator_name = rawData.entry.creator_name || ''
        let created_at = rawData.entry.created_at ? moment(rawData.entry.created_at).format('YYYY-MM-DD HH:mm:ss.SSS') : null
        let updated_at = rawData.entry.updated_at ? moment(rawData.entry.updated_at).format('YYYY-MM-DD HH:mm:ss.SSS') : null
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
    catch (e) {
        console.log(e)
        cb({"errorCode":-1,"errorMsg":'接收表单信息失败'})
    }
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
                                // console.log("DB_RESULTS:", results)
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
                // console.log("RESULTS:", results)
                cb(results.orders);
            }
        }
    );
}

// 根据ID获取在线订单信息
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
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
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
                                // console.log("DB_RESULTS:", result)
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
                // console.log("RESULTS:", results)
                cb(results.order);
            }
        }
    );
}


// 根据ID获取圣诞礼遇物品信息
exports.getAdminXmasActivityItemInfo = function(itemId, cb){
    console.log("QUERY_ItemID: ", itemId)
    async.auto({
            order:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                         FROM   form_jsj
                         WHERE  form_type = 'EXCHANGE_1' AND id = ?
                         */});

                        let sqlParam = []
                        sqlParam.push(itemId)

                        conn.query(sql, sqlParam, function (error, result) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
                                // console.log("DB_RESULTS:", result)
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
                // console.log("RESULTS:", results)
                cb(results.order);
            }
        }
    );
}

// 获取我的在线订单列表
exports.getMyOnlineOrders = function(openId, cb){
    console.log("QUERY_OpenID: ", openId)
    async.auto({
            orders:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                         FROM   form_jsj
                         WHERE  form_type = 'ONLINEORDER' AND x_field_weixin_openid = ?
                         ORDER  BY id DESC;
                         */});

                        let sqlParam = []
                        sqlParam.push(openId)

                        conn.query(sql, sqlParam, function (error, result) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
                                cb1(null, result);
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
                // console.log("RESULTS:", results)
                cb(results.orders);
            }
        }
    );
}


// 获取圣诞礼遇活动所有用户提交的物品列表
exports.getXmasActivityItems = function(minId, pageSize, cb){
    async.auto({
            items:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                         FROM form_jsj
                         __WHERE_CLAUSE__
                         ORDER  BY id DESC
                         LIMIT  ?;
                         */});

                        let sqlParams = []

                        //where条件后续添加
                        let whereClause = 'WHERE form_type = \'EXCHANGE_1\' AND order_status = \'GOT\'';
                        if(minId != -1)    { whereClause +=' and id < ?';     sqlParams.push(minId)}

                        sqlParams = sqlParams.concat([pageSize]);

                        // console.log("SQL PARAMS:", sqlParams)

                        //最终将whereClause拼接上去
                        sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                        // console.log(sql)
                        conn.query(sql, sqlParams, function (error, result) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
                                cb1(null, result);
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
                // console.log("RESULTS:", results)
                cb(results.items);
            }
        }
    );
}

// 获取圣诞礼遇活动所有用户提交的物品列表
exports.getMyXmasActivityItems = function(openId, cb){
    async.auto({
            items:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                         FROM form_jsj
                         __WHERE_CLAUSE__
                         ORDER  BY id DESC
                         */});

                        let sqlParams = []

                        //where条件后续添加
                        let whereClause = 'WHERE form_type = \'EXCHANGE_1\'';
                        if(openId)    { whereClause +=' and x_field_weixin_openid = ?';     sqlParams.push(openId)}

                        //最终将whereClause拼接上去
                        sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                        // console.log(sql)
                        conn.query(sql, sqlParams, function (error, result) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
                                cb1(null, result);
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
                // console.log("RESULTS:", results)
                cb(results.items);
            }
        }
    );
}



// 获取蓝天下至爱活动中，用户上传的物品列表
exports.getLtxzaMyItems = function(openId, activityId, cb){
    async.auto({
            items:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                         FROM form_jsj
                         __WHERE_CLAUSE__
                         ORDER  BY id DESC
                         */});

                        let sqlParams = []

                        //where条件后续添加
                        let whereClause = 'WHERE form_type = \'LTXZA\'';
                        if(openId)    { whereClause +=' and x_field_weixin_openid = ?';     sqlParams.push(openId)}
                        if(activityId)    { whereClause +=' and form = ?';     sqlParams.push(activityId)}

                        //最终将whereClause拼接上去
                        sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                        // console.log(sql)
                        conn.query(sql, sqlParams, function (error, result) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
                                cb1(null, result);
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
                // console.log("RESULTS:", results)
                cb(results.items);
            }
        }
    );
}

// 获取蓝天下至爱活动中，用户选择的盲盒
exports.getLtxzaMyBox = function(openId, activityId, cb){
    async.auto({
            items:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                         FROM form_jsj
                         __WHERE_CLAUSE__
                         ORDER  BY id DESC
                         */});

                        let sqlParams = []

                        //where条件后续添加
                        let whereClause = 'WHERE form_type = \'LTXZA_BOX\'';
                        if(openId)    { whereClause +=' and x_field_weixin_openid = ?';     sqlParams.push(openId)}
                        if(activityId)    { whereClause +=' and form = ?';     sqlParams.push(activityId)}

                        //最终将whereClause拼接上去
                        sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                        // console.log(sql)
                        conn.query(sql, sqlParams, function (error, result) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
                                cb1(null, result);
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
                // console.log("RESULTS:", results)
                cb(results.items);
            }
        }
    );
}


// 获取蓝天下至爱活动中，所有上传的物品列表
exports.getLtxzaItems = function(minId, pageSize, activityId, cb){
    async.auto({
            items:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,remark,sys_insert_dt,sys_update_dt
                         FROM form_jsj
                         __WHERE_CLAUSE__
                         ORDER  BY id DESC
                         LIMIT  ?;
                         */});

                        let sqlParams = []

                        //where条件后续添加
                        let whereClause = 'WHERE form_type = \'LTXZA\' ';
                        // let whereClause = 'WHERE form_type = \'LTXZA\' AND order_status = \'GOT\'';
                        if(minId != -1)    { whereClause +=' and id < ?';     sqlParams.push(minId)}
                        if(activityId)    { whereClause +=' and form = ?';     sqlParams.push(activityId)}

                        sqlParams = sqlParams.concat([pageSize]);

                        // console.log("SQL PARAMS:", sqlParams)

                        //最终将whereClause拼接上去
                        sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                        // console.log(sql)
                        conn.query(sql, sqlParams, function (error, result) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
                                cb1(null, result);
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
                // console.log("RESULTS:", results)
                cb(results.items);
            }
        }
    );
}




// *******************************************
//         管理相关的操作都在下面
// *******************************************

// 管理员获取在线订单列表
exports.getAdminOnlineOrders = function(param, cb){

    async.auto({
        paramCheck:function(cb){
            //TODO:参数检查
            cb(null,null);
        },
        ordersCount:['paramCheck',function(cb,dummy){
            //由于要分页，先得算算总数
            pool.getReadOnlyConnection(function (error, conn) {
                if(error){
                    console.log("ERROR_DB_CONNECT:", error)
                    cb("error_db_connect", null);
                }else{
                    let sql = heredoc(function () {/*
                         SELECT COUNT(1) AS count
                         FROM   form_jsj
                         __WHERE_CLAUSE__
                     */});
                    let sqlParams = [  ];
                    //where条件后续添加
                    let whereClause = ' WHERE form_type = \'ONLINEORDER\'';
                    if(param.genCode)    {whereClause+=' and gen_code=?';     sqlParams.push(param.genCode)}
                    if(param.mobile)    { whereClause +=' and raw_data LIKE \'%'+param.mobile+'%\''}

                    //最终将whereClause拼接上去
                    sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                    conn.query(sql, sqlParams, function (error, rows) {
                        conn.release();
                        if (error){
                            console.log("ERROR_DB_QUERY:", error)
                            cb("error_db_query", null);
                        }else if(_.isEmpty(rows)){
                            cb("没有找到订单", null);
                        }else{
                            cb(null,rows[0]['count']);
                        }
                    });
                }
            });
        }],
        orders:['paramCheck',function(cb,dummy){
            //获取学校列表基础信息
            pool.getReadOnlyConnection(function (error, conn) {
                if(error){
                    console.log("ERROR_DB_CONNECT:", error)
                    cb("error_db_connect", null);
                }else{
                    let sql = heredoc(function () {/*
                             SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                             FROM   form_jsj
                             __WHERE_CLAUSE__
                             ORDER BY ID DESC
                             limit ?,?
                     */});
                    let sqlParams = [   ];//where条件后续添加

                    //where条件后续添加
                    let whereClause = ' WHERE form_type = \'ONLINEORDER\'';
                    if(param.genCode)    { whereClause +=' and gen_code=?';     sqlParams.push(param.genCode)}
                    if(param.mobile)    { whereClause +=' and raw_data LIKE \'%'+param.mobile+'%\''}

                    sqlParams = sqlParams.concat([ (param.page-1)*param.pageSize , param.pageSize]);

                    //最终将whereClause拼接上去
                    sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                    // console.log(sql);
                    conn.query(sql, sqlParams, function (error, rows) {
                        conn.release();
                        if (error){
                            console.log("ERROR_DB_QUERY:", error)
                            cb("error_db_query", null);
                        }else if(rows.length==0){
                            cb("没有找到订单", null);
                        } else{
                            cb(null, rows||[]);
                        }
                    });
                }
            });
        }]
    },function(error,results){
        cb(error, results)
        // if (error) {
        //     cb({error: "DB_ERROR", errorMsg: "数据库操作异常"});
        // } else {
        //     cb({error: 200, errorMsg: "", data: results.orders,page:param.page,totalPage:Math.ceil(parseFloat(results.ordersCount)/param.pageSize),totalRecords:results.ordersCount});
        // }
    });
}

// 更新在线订单状态
exports.updateOnlineOrder = function(orderInfo, cb){
    let sql = "";
    let sqlParam = [];
    let id = parseInt(orderInfo.id); //
    if(id){
        async.auto({
                checkExists: function (cb1) {
                    var bExists = false;
                    sql = "SELECT id FROM form_jsj WHERE id = ? AND form_type = 'ONLINEORDER'";
                    sqlParam.push(id);
                    pool.getReadOnlyConnection(function(error,conn) {
                        if (error) {
                            console.log("db connect error");
                            cb1("error_db_connect", bExists);
                        }
                        else {
                            conn.query( sql, sqlParam , function(err,rows){
                                conn.release();
                                if(err){
                                    console.log("db query error");
                                    console.log(sql);
                                    cb1("error_db_query",bExists);
                                }
                                else{
                                    bExists = (rows.length == 1);
                                    cb1(null,bExists);
                                }
                            });
                        }
                    });
                },
                doUpdate: ['checkExists', function (cb2, results) {
                    pool.getReadOnlyConnection(function(error,conn) {
                        if (error) {
                            console.log("db connect error");
                            cb2("error_db_connect", null);
                        }
                        else {
                            if(!results.checkExists){
                                cb2("要更新的订单不存在",null);
                                console.log(schoolId);
                            }
                            else{
                                //先清空之前的参数
                                sqlParam.splice(0,sqlParam.length);
                                sql = "UPDATE form_jsj SET sys_update_dt = CURRENT_TIMESTAMP() ";

                                let order_status = orderInfo.order_status; if(order_status){sql += ",order_status = ?";sqlParam.push(order_status)};

                                sql += " WHERE id = ? AND form_type = 'ONLINEORDER'";
                                sqlParam.push(id);

                                conn.query( sql,sqlParam, function(err,rows){
                                    conn.release();
//                                    console.log(sql);
//                                    console.log(sqlParam);
                                    if(err){
                                        console.log("db query error");
                                        console.log(sql);
                                        cb2("error_db_query",null);
                                    }
                                    else{
                                        cb2(null,null);
                                    }
                                });
                            }
                        }
                    });
                }]
            },function(err,results){
                if(err){
                    cb({"errorCode":-1,"errorMsg":'更新订单信息失败'});
                    console.log("更新订单信息失败，信息如下：", err);
                }
                else{
                    cb({"errorCode":200,"errorMsg":'更新订单信息成功'});
                }
            }
        );
    }
    else{
        cb({"errorCode":-1,"errorMsg":'订单参数不正确'});
    }
}

// 管理员获取圣诞礼遇物品列表
exports.getAdminXmasActivityItems = function(param, cb){
    async.auto({
        paramCheck:function(cb){
            //TODO:参数检查
            cb(null,null);
        },
        itemsCount:['paramCheck',function(cb,dummy){
            //由于要分页，先得算算总数
            pool.getReadOnlyConnection(function (error, conn) {
                if(error){
                    console.log("ERROR_DB_CONNECT:", error)
                    cb("error_db_connect", null);
                }else{
                    let sql = heredoc(function () {/*
                         SELECT COUNT(1) AS count
                         FROM   form_jsj
                         __WHERE_CLAUSE__
                     */});
                    let sqlParams = [  ];
                    //where条件后续添加
                    let whereClause = ' WHERE form_type = \'EXCHANGE_1\'';
                    if(param.genCode)    {whereClause+=' and gen_code=?';     sqlParams.push(param.genCode)}
                    if(param.mobile)    { whereClause +=' and raw_data LIKE \'%'+param.mobile+'%\''}


                    //最终将whereClause拼接上去
                    sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                    conn.query(sql, sqlParams, function (error, rows) {
                        conn.release();
                        if (error){
                            console.log("ERROR_DB_QUERY:", error)
                            cb("error_db_query", null);
                        }else if(_.isEmpty(rows)){
                            cb("没有找到物品", null);
                        }else{
                            cb(null,rows[0]['count']);
                        }
                    });
                }
            });
        }],
        items:['paramCheck',function(cb,dummy){
            //获取学校列表基础信息
            pool.getReadOnlyConnection(function (error, conn) {
                if(error){
                    console.log("ERROR_DB_CONNECT:", error)
                    cb("error_db_connect", null);
                }else{
                    let sql = heredoc(function () {/*
                             SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                             FROM   form_jsj
                             __WHERE_CLAUSE__
                             ORDER BY ID DESC
                             limit ?,?
                     */});
                    let sqlParams = [   ];//where条件后续添加

                    //where条件后续添加
                    let whereClause = ' WHERE form_type = \'EXCHANGE_1\'';
                    if(param.genCode)    { whereClause +=' and gen_code=?';     sqlParams.push(param.genCode)}
                    if(param.mobile)    { whereClause +=' and raw_data LIKE \'%'+param.mobile+'%\''}

                    sqlParams = sqlParams.concat([ (param.page-1)*param.pageSize , param.pageSize]);

                    //最终将whereClause拼接上去
                    sql = sql.replace(/__WHERE_CLAUSE__/g,whereClause);
                    // console.log(sql);
                    conn.query(sql, sqlParams, function (error, rows) {
                        conn.release();
                        if (error){
                            console.log("ERROR_DB_QUERY:", error)
                            cb("error_db_query", null);
                        }else if(rows.length==0){
                            cb("没有找到物品", null);
                        } else{
                            cb(null, rows||[]);
                        }
                    });
                }
            });
        }]
    },function(error,results){
        cb(error, results)
        // if (error) {
        //     cb({error: "DB_ERROR", errorMsg: "数据库操作异常"});
        // } else {
        //     cb({error: 200, errorMsg: "", data: results.orders,page:param.page,totalPage:Math.ceil(parseFloat(results.ordersCount)/param.pageSize),totalRecords:results.ordersCount});
        // }
    });
}

// 更新圣诞礼遇物品状态
exports.updateXmasActivityItem = function(itemInfo, cb){
    let sql = "";
    let sqlParam = [];
    let id = parseInt(itemInfo.id); //
    if(id){
        async.auto({
                checkExists: function (cb1) {
                    let bExists = false;
                    sql = "SELECT id FROM form_jsj WHERE id = ? AND form_type = 'EXCHANGE_1'";
                    sqlParam.push(id);
                    pool.getReadOnlyConnection(function(error,conn) {
                        if (error) {
                            console.log("db connect error");
                            cb1("error_db_connect", bExists);
                        }
                        else {
                            conn.query( sql, sqlParam , function(err,rows){
                                conn.release();
                                if(err){
                                    console.log("db query error");
                                    console.log(sql);
                                    cb1("error_db_query",bExists);
                                }
                                else{
                                    bExists = (rows.length == 1);
                                    cb1(null,bExists);
                                }
                            });
                        }
                    });
                },
                doUpdate: ['checkExists', function (cb2, results) {
                    pool.getReadOnlyConnection(function(error,conn) {
                        if (error) {
                            console.log("db connect error");
                            cb2("error_db_connect", null);
                        }
                        else {
                            if(!results.checkExists){
                                cb2("要更新的圣诞礼遇物品不存在",null);
                                console.log(schoolId);
                            }
                            else{
                                //先清空之前的参数
                                sqlParam.splice(0,sqlParam.length);
                                sql = "UPDATE form_jsj SET sys_update_dt = CURRENT_TIMESTAMP() ";

                                let order_status = itemInfo.order_status; if(order_status){sql += ",order_status = ?";sqlParam.push(order_status)};

                                sql += " WHERE id = ? AND form_type = 'EXCHANGE_1'";
                                sqlParam.push(id);

                                conn.query( sql,sqlParam, function(err,rows){
                                    conn.release();
//                                    console.log(sql);
//                                    console.log(sqlParam);
                                    if(err){
                                        console.log("db query error");
                                        console.log(sql);
                                        cb2("error_db_query",null);
                                    }
                                    else{
                                        cb2(null,null);
                                    }
                                });
                            }
                        }
                    });
                }]
            },function(err,results){
                if(err){
                    cb({"errorCode":-1,"errorMsg":'更新圣诞礼遇物品信息失败'});
                    console.log("更新圣诞礼遇物品信息失败，信息如下：", err);
                }
                else{
                    cb({"errorCode":200,"errorMsg":'更新圣诞礼遇物品信息成功'});
                }
            }
        );
    }
    else{
        cb({"errorCode":-1,"errorMsg":'圣诞礼遇物品参数不正确'});
    }
}


// 根据form_id获取烘焙活动报名信息列表
exports.getAdminBakingActivityEnrolls = function(form_id, cb){
    console.log("QUERY_FormID: ", form_id)
    async.auto({
            enrolls:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                         FROM   form_jsj
                         WHERE  form_type = 'BAKING' AND form = ?
                         ORDER  BY id DESC
                         */});

                        let sqlParam = []
                        sqlParam.push(form_id)

                        conn.query(sql, sqlParam, function (error, results) {
                            conn.release();
                            if (error) {
                                console.log("ERROR_DB_QUERY:", error)
                                cb1("error_db_query", null);
                            } else {
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
                // console.log("RESULTS:", results)
                cb(results.enrolls);
            }
        }
    );
}


exports.insert_ord_order = function(orderInfo, cb){
    try{
        async.auto({
                insertDB:function(cb1){
                    pool.getConnection(function (error, conn) {
                        if (error) {
                            cb1("error_db_connect", null);
                        } else {
                            let sql = heredoc(function () {/*
                             INSERT INTO ord_orders(form_jsj_id,order_status,contact_name,contact_mobile,pickup_location,rec_code
                                ,order_items,total_price,preferential_price,trade_no,trade_status,payment_method
                                ,gen_code,weixin_openid,weixin_headimgurl,weixin_nickname,weixin_gender
                                ,weixin_province,weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt)
                             VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW());
                             */});
                            let sqlParam = []

                            sqlParam.push(orderInfo.id)
                            sqlParam.push(orderInfo.order_status)
                            sqlParam.push(orderInfo.contactName)
                            sqlParam.push(orderInfo.contactMobile)
                            sqlParam.push(orderInfo.pickupLocation)
                            sqlParam.push(orderInfo.rec_code)
                            sqlParam.push(JSON.stringify(orderInfo.orderItems))
                            sqlParam.push(orderInfo.total_price)
                            sqlParam.push(orderInfo.preferential_price)
                            sqlParam.push(orderInfo.trade_no)
                            sqlParam.push(orderInfo.trade_status)
                            sqlParam.push(orderInfo.payment_method)
                            sqlParam.push(orderInfo.gen_code)
                            sqlParam.push(orderInfo.x_field_weixin_openid)
                            sqlParam.push(orderInfo.x_field_weixin_headimgurl)
                            sqlParam.push(orderInfo.x_field_weixin_nickname)
                            sqlParam.push(orderInfo.x_field_weixin_gender)
                            sqlParam.push(orderInfo.x_field_weixin_province)
                            sqlParam.push(orderInfo.x_field_weixin_city)
                            sqlParam.push(orderInfo.creator_name)
                            sqlParam.push(orderInfo.created_at)
                            sqlParam.push(orderInfo.updated_at)
                            sqlParam.push(orderInfo.info_remote_ip)

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
                    cb({"errorCode":-1,"errorMsg":'插入订单表信息失败'});
                } else {
                    cb(null);
                }
            }
        );

    }
    catch (e) {
        console.log(e)
        cb({"errorCode":-1,"errorMsg":'插入订单表信息失败'})
    }
}

exports.get_latest_orders_from_form_jsj = function(cb){
    let max_form_jsj_id = -1
    async.auto({
        max_form_jsj_id:function(cb1){
                pool.getConnection(function (error, conn) {
                    if (error) {
                        console.log("ERROR_DB_CONNECT:", error)
                        cb1("error_db_connect", null);
                    } else {
                        let sql = heredoc(function () {/*
                         SELECT MAX(form_jsj_id) AS max_form_jsj_id
                         FROM   ord_orders;
                         */});

                        conn.query(sql, function (error, results) {
                            conn.release();
                            if (error || !results) {
                                console.log("ERROR_DB_QUERY:", error)

                            } else {
                                // console.log("DB_RESULTS:", results)
                                // console.log("max_form_jsj_id now is ", max_form_jsj_id)
                                max_form_jsj_id = results.length == 1 ? results[0].max_form_jsj_id||max_form_jsj_id : max_form_jsj_id
                            }
                            console.log("MAX_FORM_JSJ_ID:",max_form_jsj_id)
                            cb1(null, max_form_jsj_id);
                        });
                    }
                });
            },
        orders: ['max_form_jsj_id', function(cb2, results){
            pool.getReadOnlyConnection(function(error,conn) {
                if (error) {
                    console.log("db connect error");
                    cb2("error_db_connect", null);
                }
                else {
                    if(!results.max_form_jsj_id){
                        cb2("获取已转换的最大订单ID失败",null);
                    }
                    else{
                        let sqlParams = []
                        sqlParams.push(results.max_form_jsj_id)

                        let sql = heredoc(function () {/*
                             SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
                               ,payment_method,gen_code
                               ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
                               ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
                             FROM   form_jsj
                             WHERE  form_type = 'ONLINEORDER' AND id > ?
                     */});

                        conn.query( sql,sqlParams, function(err,rows){
                            conn.release();
                            if(err){
                                console.log("db query error");
                                console.log(sql);
                                cb2("error_db_query",null);
                            }
                            else{
                                cb2(null,rows);
                            }
                        });
                    }
                }
            });
        }]
        },function(err,results){
            if (err) {
                console.log("ERROR_FUNCTION:", err)
                cb([]);
            } else {
                // console.log("RESULTS:", results)
                cb(results.orders);
            }
        }
    );
}

