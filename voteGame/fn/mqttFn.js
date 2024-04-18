/*
 * @Author: Double Lee
 * @Date: 2022-06-21 17:17:08
 * @LastEditions: Double Lee
 * @LastEditTime: 2024-04-18 08:53:43
 * @Description: file content
 */
var host = 'broker.emqx.io' // 环信MQTT服务器地址 通过console后台[MQTT]->[服务概览]->[服务配置]下[连接地址]获取
var port = 8083 // 协议服务端口 1883/1884/80/443 通过console后台[MQTT]->[服务概览]->[服务配置]下[连接端口]获取

var useTLS = false // 是否走加密 HTTPS，如果走 HTTPS，设置为 true
var cleansession = false;
var clientId = 'emqx' + Math.random().toString(16).substr(2, 8) // 客户端ID，随机生成即可
var reconnectTimeout = 2000 // 超时重连时间
var username = null // 用户名

var mqtt

// When Page is loaded
$(function () {
    MQTTconnect()
});

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
    }
    options.useSSL = useTLS // 如果使用 HTTPS 加密则配置为 true
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
    mqttmsg.destinationName = topic.toLowerCase() // set topic
    mqttmsg.retained = retain;
    mqtt.send(mqttmsg)
}
