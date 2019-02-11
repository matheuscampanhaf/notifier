var dojotModule = require('@dojot/dojot-module');
var uuid4 = require('uuid4');

var config = dojotModule.Config;

var messenger = new dojotModule.Messenger("notificationSender", config);
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

messenger.init().then(() => {
    console.log("initialization success");

    messenger.createChannel("dojot.notification", "w", false);

    

    publish();
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function publish(){
    const notification = {
        msgID: uuid4(),
        timestamp: Date.now(),
        metaAttrsFilter: {
            level: 1,
        },
        message: "DEU ALGUMA COISA MUITO ERRADO",
        subject: "debug"
    }
    await sleep(1000);
    messenger.publish("dojot.notification", "admin", JSON.stringify(notification));
}