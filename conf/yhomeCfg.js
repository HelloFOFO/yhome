
let mapOrderStatus = {
    "INIT":"新提交",
    "RETURN":"已退款",
    "PICKED":"已提货"
}

let mapItemStatus = {
    "INIT":"新提交",
    "RETURN":"已退回",
    "CONFIRMED":"待收物品",
    "GOT":"已收到物品"
}


let jsjItemMapping = {
    "XpjHqw":{
        "items": "field_1",
        "contactName": "field_2",
        "contactMobile": "field_3",
        "pickupLocation": "field_6",
    },
    "X72F7t":{
        "itemName":"field_2",
        "itemPicUrl":"field_1",
        "contactName": "field_3",
        "contactMobile": "field_4"
    },
    "AWP5MW":{
        "items": "field_1",
        "contactName": "field_2",
        "contactMobile": "field_3",
    }
}

let jsjFormNameMapping = {
    "AWP5MW":"十二月烘焙活动报名"
}

module.exports = {mapOrderStatus: mapOrderStatus, jsjItemMapping: jsjItemMapping, mapItemStatus: mapItemStatus, jsjFormNameMapping: jsjFormNameMapping}