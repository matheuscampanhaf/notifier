"use strict"

var dojotModule = require('@dojot/dojot-module');
var logger = require('@dojot/dojot-module-logger').logger;
var sio = require("socket.io");
var filter = require('./filters');
var FilterManager = require('./FilterManager').FilterManager;
var config = dojotModule.Config;



class SocketIOHandler {

    constructor(httpServer) {
        this.messenger = new dojotModule.Messenger("notifier", config);
        this.ioServer = sio(httpServer);

        this.fManager = new FilterManager();

        this.filtersList = filter;

        this.messenger.init();
        this.messenger.createChannel("dojot.notification", "r", false);
        this.messenger.on("dojot.notification", "message", this.handleNotification.bind(this));

        this.ioServer.on('connection', (socket) => {
            logger.debug("Got a new socket IO connection")
        });
    }

    /**
     * Callback registered to handle notifications that came on kafka
     * @param {string} ten 
     * @param {string} msg 
     */
    handleNotification(ten, msg) {
        logger.debug("Received notification, will apply filters...", { filename: "SocketIOHandler" });
        logger.debug("Notification is: " + msg, { filename: "SocketIOHandler" });
        logger.debug("Will check if it matches the filter...", { filename: "SocketIOHandler" });
        let msgObj = JSON.parse(msg);
        if (this.checkFilter(msgObj)) {
            this.ioServer.emit('chat message', msg);
        }
    }

    /**
     * Apply the connection filter to the message to check if it will be forward to the application by SocketIO
     * @param {string} msg 
     */
    checkFilter(msg) {
        // Provavelmente aqui terá alguma coisa de identificar a conexão para ver qual o filtro da mesma
        // this.filterManager.getFilter();
        logger.debug("Checking filter", { filename: "SocketIOHandler" })
        let retOperation;
        for (var key in this.filtersList['fields']) {
            console.log(`key is: ${key}`)
            if (this.filtersList.fields.hasOwnProperty(key)) {
                console.log("I have this key")
                if (key === "subject") {
                    if (msg.hasOwnProperty('subject')) {
                        console.log("Notification has subject in its fields")
                        retOperation = this.fManager.applyOperation(this.filtersList.fields['subject']['operation'],
                            msg['subject'], this.filtersList.fields['subject']['value']);
                        logger.debug(`Return from operation over field subject is ${retOperation}`, { filename: "SocketIOHandler" });
                        if (!retOperation) {
                            return retOperation;
                        }
                    }
                } else {
                    if (msg['metaAttrsFilter'].hasOwnProperty(key)) {
                        retOperation = this.fManager.applyOperation(this.filtersList.fields[key]['operation'],
                            msg['metaAttrsFilter'][key], this.filtersList.fields[key]['value']);
                        logger.debug(`Return from operation over field ${key} is ${retOperation}`, { filename: "SocketIOHandler" });
                        if (!retOperation) {
                            return retOperation;
                        }
                    }
                }
            }
        }
        return 1;
    }

}

module.exports = { SocketIOHandler }