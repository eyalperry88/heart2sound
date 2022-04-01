const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({ path: '/dev/cu.usbmodem14401', baudRate: 250000 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

// Read the port data
port.on("open", () => {
  console.log('serial port open');
});
parser.on('data', data =>{
  console.log('got word from arduino:', data);
  sendData(data);
});

// Set Up HTTP Server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

var sock = null;
io.on('connection', (socket) => {
  console.log('a user connected');
  sock = socket;
  socket.on('disconnect', () => {
    console.log('a user disconnected');
    sock = null;
  });
});

function sendData(data) {
 if (sock != null) {
   sock.emit('data', data);
 }
}
