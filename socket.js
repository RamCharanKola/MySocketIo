const express = require('express');
const { createServer } = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const httpServer = createServer();
const io = new Server(httpServer,{
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    }
});

io.on('connect', (socket) =>{
    console.log('Socked Connected In Backed');
});

httpServer.listen(3000, () =>{
    console.log('Server is started and running in port 3000');
})