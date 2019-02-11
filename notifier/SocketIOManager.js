"use strict";

var logger = require('@dojot/dojot-module-logger').logger;
var { SocketIOHandler } = require('./SocketIOHandler');

class SocketIOManager {

    constructor() {
        this.handler = null;
    }
/**
 * returns the SocketIO server instance
 * @param {httpServer} httpServer 
 */
    getInstance(httpServer) {
        if (this.handler != null) {
            return this.handler;
        }
        if (httpServer) {
            this.handler = new SocketIOHandler(httpServer);
            return this.handler;
        }

        logger.debug("Failed to instantiate socketio server");
    }

    
}

var sioManager = new SocketIOManager();

module.exports =  { sioManager };