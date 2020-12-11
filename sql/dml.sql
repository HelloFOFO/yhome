

SELECT COUNT(*) FROM form_jsj WHERE form_type = 'ONLINEORDER';
SELECT * FROM form_jsj WHERE form_type = 'ONLINEORDER' ORDER BY id DESC LIMIT 10;
SELECT * FROM form_jsj WHERE form_type = 'ONLINEORDER' ORDER BY id DESC;

SELECT * FROM form_jsj LIMIT 10 ;
-- TRUNCATE TABLE form_jsj;

SELECT id,order_status,form_type,raw_data,form,form_name,serial_number,total_price,preferential_price,trade_no,trade_status
   ,payment_method,gen_code
   ,x_field_weixin_openid,x_field_weixin_headimgurl,x_field_weixin_nickname,x_field_weixin_gender
   ,x_field_weixin_province,x_field_weixin_city,creator_name,created_at,updated_at,info_remote_ip,sys_insert_dt,sys_update_dt
FROM form_jsj
WHERE form_type = 'EXCHANGE_1'
ORDER  BY id DESC
LIMIT  5;
                         

-- 烘焙报名
SELECT * FROM form_jsj WHERE form_type = 'BAKING'  ORDER BY id DESC LIMIT 100;

-- 圣诞礼遇管理
SELECT * FROM form_jsj WHERE form_type = 'EXCHANGE_1' LIMIT 10 ;

