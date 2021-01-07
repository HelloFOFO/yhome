
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
        "recCode": "field_8"
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
    },
    "V5YuIy":{
        "items": "field_1",
        "contactName": "field_2",
        "contactMobile": "field_3",
        "pickupLocation": "field_5",
    },
    "BjBjYp":{
        "itemName":"field_2",
        "itemPicUrl":"field_1",
        "contactName": "field_3",
        "contactMobile": "field_4",
        "contactBuilding": "field_6"
    },
    "PNvPtm":{
        "boxName":"field_1",
        "boxAmount":"field_2",
        "contactName": "field_3",
        "contactMobile": "field_4",
    }
}

let jsjFormNameMapping = {
    "AWP5MW":"十二月烘焙活动报名",
    "BjBjYp":" 小宇家【蓝天下的至爱】普雄居委专场",
    "PNvPtm":" 小宇家【蓝天下的至爱】普雄居委专场"
}

module.exports = {mapOrderStatus: mapOrderStatus, jsjItemMapping: jsjItemMapping, mapItemStatus: mapItemStatus, jsjFormNameMapping: jsjFormNameMapping}