var express = require('express');
var router = express.Router();
var webAction = require('./../action/webAction')



router.post('/ajax/get_form_data_jsj',webAction.insertJSJ);

router.get('/onlinemarket/jsj/feedback', webAction.wxAuth, webAction.jsjOnlineOrderFeedback)
router.get('/onlinemarket/myorders', webAction.wxAuth, webAction.yHomeAuth, webAction.renderMyOnlineOrders)
router.get('/onlinemarket/order/:id', webAction.wxAuth, webAction.yHomeAuth, webAction.renderOnlineOrder)

module.exports = router;
