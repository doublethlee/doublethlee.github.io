/*
 * @Author: Double Lee
 * @Date: 2022-06-21 17:17:08
 * @LastEditions: Double Lee
 * @LastEditTime: 2022-06-22 14:42:15
 * @Description: file content
 */
var host = '//2uz2f0.cn1.mqtt.chat' // 环信MQTT服务器地址 通过console后台[MQTT]->[服务概览]->[服务配置]下[连接地址]获取
var port = 443 // 协议服务端口 1883/1884/80/443 通过console后台[MQTT]->[服务概览]->[服务配置]下[连接端口]获取
var appId = '2uz2f0' // appID 通过console后台[MQTT]->[服务概览]->[服务配置]下[AppID]获取
var appClientId = 'YXA63dzXkMkPRxWdM5UK2kei4A' // 开发者ID 通过console后台[应用概览]->[应用详情]->[开发者ID]下[ Client ID]获取
var appClientSecret =
    'YXA6kkLfr2i66bt9t9iRb7sVcP7Nh10' // 开发者密钥 通过console后台[应用概览]->[应用详情]->[开发者ID]下[ ClientSecret]获取
var restApiUrl =
    'https://api.cn1.mqtt.chat/app/2uz2f0' // 环信MQTT REST API地址 通过console后台[MQTT]->[服务概览]->[服务配置]下[REST API地址]获取

var useTLS = true // 是否走加密 HTTPS，如果走 HTTPS，设置为 true
var cleansession = false;
var clientId = deviceId + '@' + appId // deviceID@AppID
var reconnectTimeout = 2000 // 超时重连时间
var username = 'double' // 自定义用户名 长度不超过64位即可
var password = '123' // 用户密码通过getUserToken方法获取

var mqtt

// 客户端获取应用Token 
function getAppToken() {
    var request = new XMLHttpRequest()
    // 拼接token接口
    var api = `${restApiUrl}/openapi/rm/app/token`
    // Post请求
    request.open('post', api)
    // 设置Content-Type
    request.setRequestHeader('Content-Type', 'application/json')

    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) {
                var res = JSON.parse(request.responseText)
                // 从响应体中解析出appToken
                var appToken = res.body.access_token
                console.log('appToken:', appToken)
                getUserToken(appToken)
            } else {
                throw new Error('请求失败，响应码为' + request.status)
            }
        }
    }

    var params = {
        appClientId: appClientId,
        appClientSecret: appClientSecret,
    }
    // 发送ajax请求
    request.send(JSON.stringify(params))
}


// 获取用户Token
function getUserToken(appToken) {
    var request = new XMLHttpRequest()
    // 拼接token接口
    var api = `${restApiUrl}/openapi/rm/user/token`
    // Post请求
    request.open('post', api)
    // 设置Content-Type
    request.setRequestHeader('Content-Type', 'application/json')
    // 设置Authorization
    request.setRequestHeader('Authorization', appToken)

    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) {
                var res = JSON.parse(request.responseText)
                // 从响应体中解析出userToken
                var userToken = res.body.access_token
                console.log('userToken:', userToken)
                password = userToken
                // 连接MQTT    
                MQTTconnect()
            } else {
                throw new Error('请求失败，响应码为' + request.status)
            }
        }
    }
    var params = {
        username: username,
        expires_in: 86400, // 过期时间，单位为秒，默认为3天，如需调整，可提工单调整
        cid: clientId
    }
    // 发送ajax请求
    request.send(JSON.stringify(params))
}

getAppToken()

function MQTTconnect() {
    mqtt = new Paho.MQTT.Client(
        host,
        port,
        clientId
    )

    var options = {
        timeout: 3,
        onSuccess: onConnect,
        mqttVersion: 4,
        cleanSession: cleansession,
        keepAliveInterval: 45,
        onFailure: function (message) {
            setTimeout(MQTTconnect, reconnectTimeout)
        }
    }

    mqtt.onConnectionLost = onConnectionLost
    mqtt.onMessageArrived = onMessageArrived

    if (username != null) {
        options.userName = username
        options.password = password
        options.useSSL = useTLS // 如果使用 HTTPS 加密则配置为 true
    }
    mqtt.connect(options)
}

function onConnectionLost(response) {
    setTimeout(MQTTconnect, reconnectTimeout)
}

function onMessageArrived(message) {
    var topic = message.destinationName
    var payload = message.payloadString
    console.log("recv msg : " + topic + "   " + payload)
    processMsg(topic, payload);
}

function sendMQTT(topic, message, retain) {
    const mqttmsg = new Paho.MQTT.Message(message) //set body
    mqttmsg.destinationName = topic // set topic
    mqttmsg.retained = retain;
    mqtt.send(mqttmsg)
}