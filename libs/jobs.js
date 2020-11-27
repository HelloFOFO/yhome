let pool   = require('./../libs/dbpool');
let async  = require('async');
let moment = require('moment');


//只有接口里会用到的函数，为了写sql方便，不用拼字符串
var heredoc = function(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
};


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

