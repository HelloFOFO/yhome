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


