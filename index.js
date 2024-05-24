// import express from 'express';
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
var corsOptions = {
  origin: 'http://localhost:8100',
  credentials: true,
    optionSuccessStatus: 200 
}
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS, PATCH, DELETE');
  next();
});

app.use(express.json());

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  res.send({result: "Response From Server!!!!!!"})
});

// app.connect()

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
  console.log('a user connected');
  console.log('connect ID or Socket ID : ', socket.id);
//   io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});