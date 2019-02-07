var dojotModule = require('@dojot/dojot-module');
var logger = require('@dojot/dojot-module-logger').logger;
var sio = require("socket.io");
var filter = require('./filters');
var config = dojotModule.Config;



class SocketIOHandler {

    constructor(httpServer) {
        this.messenger = new dojotModule.Messenger("notifier", config);
        this.ioServer = sio(httpServer);

        this.filtersList = filter;

        this.messenger.init();
        this.messenger.createChannel("dojot.notification", "r", false);
        this.messenger.on("dojot.notification", "message", this.handleNotification.bind(this));

        this.ioServer.on('connection', (socket) => {
            logger.debug("Got a new socket IO connection")
        });
    }

    handleNotification(ten, msg) {
        logger.debug("Received notification, will apply filters...", {filename: "SocketIOHandler"});
        logger.debug("Notification is: " + msg, {filename: "SocketIOHandler"});
        logger.debug("Will check if it matches the filter...", {filename: "SocketIOHandler"});
        if(this.checkFilter(msg)){
            this.ioServer.emit('chat message', msg);
        }
    }

    checkFilter(msg){
        // Provavelmente aqui terá alguma coisa de identificar a conexão para ver qual o filtro da mesma
        // this.filterManager.getFilter();
        for (var key in this.filtersList['fields']){
            if(this.filtersList.hasOwnProperty(key)){
                if (key == )
            }
        }
    }

}

module.exports = { SocketIOHandler }