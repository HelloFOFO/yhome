
let mapOrderStatus = {
    "INIT":"新提交",
    "RETURN":"已退款",
    "PICKED":"已提货"
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
        "itemPicUrl":"field_1"
    }
}

module.exports = {mapOrderStatus: mapOrderStatus, jsjItemMapping: jsjItemMapping}