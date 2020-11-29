/**
 * Created by zhisongli on 14-9-29.
 */
function sleep(sleepTime) {
    for(var start = Date.now(); Date.now() - start <= sleepTime; ) { }
}

// 有输入即可
var checkInput = function(input){
    return (input.trim().length > 0);
}

//判断是否整数
var checkInputInteger = function(input){
    if(input.length > 0){
        var reg=/^[-+]?\d*$/;
        return(reg.test(input));
    }
    else{
        return false;
    }
}

