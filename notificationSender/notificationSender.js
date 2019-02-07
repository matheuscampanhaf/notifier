var dojotModule = require('@dojot/dojot-module');
var uuid4 = require('uuid4');

var config = dojotModule.Config;

var messenger = new dojotModule.Messenger("notificationSender", config);


messenger.init();
messenger.createChannel("dojot.notification", "w", false);

const notification = {
    msgID: uuid4(),
    timestamp: Date.now(),
    metaAttrsFilter: { 
        severity: 10,
    },
    message: "DEU ALGUMA COISA MUITO ERRADO",
    subject: "systemNotification"
}

messenger.publish("dojot.notification", "admin", JSON.stringify(notification));

