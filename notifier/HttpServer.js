var app = require('express')();
var http = require('http').Server(app);
// var io = require('socket.io')(http);
var sioManager = require('./SocketIOManager').sioManager;

sioManager.getInstance(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//     socket.on('chat message', function(msg){
//       console.log('message: ' + msg);
//     });
//   });

http.listen(3000, () => {
  console.log('listening on *:3000');
});