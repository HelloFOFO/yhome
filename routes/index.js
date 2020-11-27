var express = require('express');
var router = express.Router();
var webAction = require('./../action/webAction')



router.post('/ajax/get_form_data_jsj',webAction.insertJSJ);

module.exports = router;
