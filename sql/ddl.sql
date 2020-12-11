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

