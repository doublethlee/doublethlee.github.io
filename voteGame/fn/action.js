/*
 * @Author: Double Lee
 * @Date: 2022-06-22 09:18:48
 * @LastEditions: Double Lee
 * @LastEditTime: 2022-06-23 10:39:26
 * @Description: file content
 */
let userName;
let action;
let originColor;

let questShowTime;

var ua = navigator.userAgent.toLowerCase();
function isWeiXin() {
    if (ua.match(/MicroMessenger/i) == 'micromessenger' && ua.match(/WindowsWechat/i) != 'windowswechat' && ua.match(/WechatDevTools/i) !='wechatdevtools') {
        return true;
    }
    else {
        return false;
    }
}
 
 
if(isWeiXin()){
    // location.href="./openInBrowser.html";
}

$(function () {
    $("#userName").focus();

    if (localStorage['userName']) {
        userName = localStorage['userName'];
        renderMainPage();
    }

    if(localStorage.action) {
        doAction();
    }

    $("#btnAns1").hide();
    $("#btnAns2").hide();
    $("#btnAns3").hide();
    $("#btnAns4").hide();

    if(!originColor) {
        originColor = $("#btnAns1").css('background-color');
    }

    $("#btnAns1").css('background-color',originColor);
    $("#btnAns2").css('background-color',originColor);
    $("#btnAns3").css('background-color',originColor);
    $("#btnAns4").css('background-color',originColor);
});

function enterName() {
    if($("mqttStatus").is(':hidden')) {
        errMsg('Connecting failed..');
        return;
    }

    if ($("#userName").val().length < 1 ) {
        errMsg('Please fill your name~~');
        $("#userName").focus();
        return;
    }

    if(isSpecialChar($("#userName").val())) {
        errMsg(`Please don't use special character!!!`);
        $("#userName").focus();
        $("#userName").val('');
        return;
    }

    userName = $("#userName").val();
    localStorage['userName'] = userName;
    renderMainPage();

    sendMQTT(`users/${userName}`, userName, true);
}

function isSpecialChar(str) {
    //把特殊字符放在数组里
    var specialchar = ['.', '_', '@', '/', '\\', '|', '#', '*'];
    for (var key in specialchar) {
        if (str.indexOf(specialchar[key]) >= 0) {
            return true;
        }
    }
    return false;
}

function renderMainPage() {
    $("#step1").hide();
    $("#step2").show();
    $("#userInfo").show();
    $("#showName").html(userName);

    if(action=='START') {
        $("#step2").hide();
        $("#step3").show();
    }
}

function errMsg(Msg) {
    $("#errMsg").effect('pulsate', {}, 2000);
    $("#errMsg").html(Msg);
    setTimeout(() => {
        $("#errMsg").html('');
    }, 3000);
}

function logout() {
    sendMQTT('logout', userName, false);
    sendMQTT(`users/${userName}`, '', true);
    localStorage.removeItem('userName');
    $("#userName").val('');
    $("#step1").show();
    $("#step2").hide();
    $("#step3").hide();
    $("#userInfo").hide();
}

function ans(ansno) {

    $("#btnAns1").css('background-color',originColor);
    $("#btnAns2").css('background-color',originColor);
    $("#btnAns3").css('background-color',originColor);
    $("#btnAns4").css('background-color',originColor);
    sendMQTT(`useranswer/${userName}`, 
    JSON.stringify(
        {
            myans: ansno,
            anstime: new Date().getTime() - questShowTime,
            who: userName
        }
    )
    , true);
    $("#btnAns" + ansno).css('background-color','yellow');

    localStorage.myans = ansno;
}