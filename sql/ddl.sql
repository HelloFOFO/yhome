

CREATE TABLE form_jsj(
id int auto_increment PRIMARY KEY,
raw_data varchar(8000),
form varchar(20),
form_name varchar(50),
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

