var express = require('express');
var router = express.Router();
var webAction = require('./../action/webAction')



router.post('/ajax/get_form_data_jsj',webAction.insertJSJ);

router.get('/onlinemarket/jsj/feedback', webAction.wxAuth, webAction.jsjOnlineOrderFeedback)
router.get('/onlinemarket/myorders', webAction.wxAuth, webAction.yHomeAuth, webAction.renderMyOnlineOrders)
router.get('/onlinemarket/order/:id', webAction.wxAuth, webAction.yHomeAuth, webAction.renderOnlineOrder)


router.get('/admin/onlinemarket/orderlist', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.renderAdminOnlineOrders)
router.get('/admin/ajax/onlinemarket/orders', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.getAdminOrders)
router.get('/admin/onlinemarket/order/:id', webAction.wxAuth, webAction.yHomeAdminAuth, webAction.renderAdminOnlineOrder)
router.post('/admin/ajax/onlinemarket/orderupdate', webAction.wxAuth,webAction.yHomeAdminAuth, webAction.orderUpdate)

module.exports = router;
