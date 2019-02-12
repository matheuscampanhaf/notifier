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

        this.ioServer.on('connection', (socket) => {
            logger.debug("Got a new socket IO connection", { filename: "SocketIOHandler" });
            this.messenger.on("dojot.notification", "message", (ten, msg) => {
                if (this.fManager.checkFilter(msg, socket.id)) {
                    socket.emit("notification", msg);
                }
            })
            socket.on('filter', (filter) => {
                this.fManager.update(JSON.parse(filter), socket.id);
            });
            socket.on('disconnect', () => {
                logger.debug(`Socket ${socket.id} has disconnected, removing it's filter...`, { filename: "SocketIOHandler" });
                this.fManager.removeFilter(socket.id);
            })
        });
    }

}

module.exports = { SocketIOHandler }