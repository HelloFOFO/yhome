let express = require('express');
let router = express.Router();
let webAction = require('./../action/webAction')
let jobs = require('./../libs/jobs')
let moment = require('moment')


router.post('/ajax/get_form_data_jsj',webAction.insertJSJ);

router.get('/onlinemarket/jsj/feedback', webAction.wxAuth, webAction.jsjOnlineOrderFeedback)
router.get('/onlinemarket/myorders', webAction.wxAuth, webAction.yHomeAuth, webAction.renderMyOnlineOrders)
router.get('/onlinemarket/order/:id', webAction.wxAuth, webAction.yHomeAuth, webAction.renderOnlineOrder)


router.get('/exchange/xmasActivityItems', webAction.wxAuth, webAction.yHomeAuth, webAction.renderXmasActivityItems)
router.get('/ajax/exchange/xmasActivityItems', webAction.wxAuth,webAction.yHomeAuth, webAction.getXmasActivityItems)
router.get('/exchange/myXmasActivityItems', webAction.wxAuth, webAction.yHomeAuth, webAction.renderMyXmasActivityItems)
router.get('/ajax/exchange/myXmasActivityItems', webAction.wxAuth,webAction.yHomeAuth, webAction.getMyXmasActivityItems)



router.get('/admin/onlinemarket/orderlist', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.renderAdminOnlineOrders)
router.get('/admin/ajax/onlinemarket/orders', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.getAdminOrders)
router.get('/admin/onlinemarket/order/:id', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.renderAdminOnlineOrder)
router.post('/admin/ajax/onlinemarket/orderupdate', webAction.wxAuth,webAction.yHomeAdminAuth, webAction.orderUpdate)


router.get('/admin/exchange/xmasActivityItems', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.renderAdminXmasActivityItems)
router.get('/admin/ajax/exchange/xmasActivityItems', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.getAdminXmasActivityItems)
router.get('/admin/exchange/xmasActivityItem/:id', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.renderAdminXmasActivityItem)
router.post('/admin/ajax/exchange/xmasActivityItemUpdate', webAction.wxAuth,webAction.yHomeAdminAuth, webAction.xmasActivityItemUpdate)



// 蓝天下至爱系列
router.get('/activity/ltxza', webAction.wxAuth, webAction.yHomeAuth, webAction.renderActivityLtxza)

router.get('/activity/ltxza/:activityId/myItems', webAction.wxAuth, webAction.yHomeAuth, webAction.renderLtxzaMyItems)
router.get('/ajax/activity/ltxza/:activityId/myItems', webAction.wxAuth, webAction.yHomeAuth, webAction.getLtxzaMyItems)
router.get('/activity/ltxza/:activityId/items', webAction.wxAuth, webAction.yHomeAuth, webAction.renderLtxzaItems)
router.get('/ajax/activity/ltxza/:activityId/items', webAction.wxAuth,webAction.yHomeAuth, webAction.getLtxzaItems)




// 查看烘焙活动详情情况
router.get('/admin/baking/activity/:form_id', webAction.wxAuth,webAction.yHomeAdminAuth, webAction.renderAdminBakingActivity )


// job任务的url调用
router.get('/admin/jobs/insert_ord_orders', function(req, res){
    jobs.insert_ord_orders(function(err){
        res.send(moment().format("YYYY-MM-DD HH:mm:ss") +"\n\r"+ err.errMsg )
    })

})

module.exports = router;
