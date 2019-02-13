"use strict"

//This is a SocketIO client that receive realtime information about dojot notifications

var io = require('socket.io-client');
var axios = require('axios');
var dojot = require('@dojot/dojot-module');

const auth = dojot.Auth;
const url = "http://172.26.0.8/socketio";
const headers = {
    authorization: "Bearer " + auth.getManagementToken("admin")
};
const target = "http://172.26.0.8"


axios({
    url,
    headers,
    method: "get"
}).then((response) => {
    console.log(response.data.token);
    let token = response.data.token;
    console.log("Requesting SocketIO connection with data-broker...")

    let notification = { "fields": { "subject": { "operation": "=", "value": "debug" }, "level": { "operation": ">", "value": 2 } } };

    //Configuring SocketIO
    let sio = io(target, {
        query: {
            token: token,
            subject: "dojot.notifications"
        },
        transports: ['polling']
    });
    sio.on('notification', (data) => {
        console.log(data);
    });
    sio.on('connect', () => {
        console.log("...Successfully connected to data-broker");
        console.log("Will emit a message...");
        sio.emit('filter', JSON.stringify(notification));       
        console.log("Waiting for messages...");
    });

}).catch((error) => {
    console.log("error : " + error)
});