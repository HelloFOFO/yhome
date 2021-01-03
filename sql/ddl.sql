-- DROP TABLE IF EXISTS form_jsj;

CREATE TABLE form_jsj(
id int auto_increment PRIMARY KEY,
raw_data varchar(8000),
form varchar(20),
form_name varchar(50),
serial_number float,
total_price float,
preferential_price float,
trade_no varchar(50),
trade_status varchar(20),
payment_method varchar(10),
gen_code varchar(10),
x_field_weixin_openid varchar(100),
x_field_weixin_headimgurl varchar(200),
x_field_weixin_nickname varchar(50),
x_field_weixin_gender varchar(4),
x_field_weixin_province varchar(10),
x_field_weixin_city varchar(10),
creator_name varchar(50),
created_at datetime,
updated_at datetime,
info_remote_ip varchar(40),
sys_insert_dt datetime,
sys_update_dt timestamp ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE form_jsj ADD form_type varchar(20) AFTER id;

-- INIT：新提交
-- RETURN： 已退款
-- PICKED： 已提货
ALTER TABLE form_jsj DROP COLUMN order_status;
ALTER TABLE form_jsj ADD order_status varchar(10) DEFAULT 'INIT' AFTER id ;  


-- 在线订单表，目前需要从 form_jsj 里面复制过来，并做一定的解析
-- DROP TABLE IF EXISTS ord_orders;
CREATE TABLE ord_orders (
  order_id int auto_increment,
  form_jsj_id int,
  order_status varchar(10) DEFAULT 'INIT',
  contact_name varchar(50),
  contact_mobile varchar(50),
  pickup_location varchar(100),
  rec_code int,                 -- 推广码
  rec_status varchar(10) DEFAULT 'INIT',       -- 推广状态（INIT、CASHED...）
  order_items varchar(2000),  -- 订单物品明细，数组格式的文本
  total_price float DEFAULT NULL,
  preferential_price float DEFAULT NULL,
  trade_no varchar(50) DEFAULT NULL,
  trade_status varchar(20) DEFAULT NULL,
  payment_method varchar(10) DEFAULT NULL,
  gen_code varchar(10) DEFAULT NULL,
  weixin_openid varchar(100) DEFAULT NULL,
  weixin_headimgurl varchar(200) DEFAULT NULL,
  weixin_nickname varchar(50) DEFAULT NULL,
  weixin_gender varchar(4) DEFAULT NULL,
  weixin_province varchar(10) DEFAULT NULL,
  weixin_city varchar(10) DEFAULT NULL,
  creator_name varchar(50) DEFAULT NULL,
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  info_remote_ip varchar(40) DEFAULT NULL,
  sys_insert_dt datetime DEFAULT NULL,
  sys_update_dt timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id)
) ENGINE=MyISAM AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8;
