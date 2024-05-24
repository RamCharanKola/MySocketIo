import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, 
    {
    cors: {
        origin: '*',
        methods: ["GET", "POST","HEAD"]
    }
}
);

app.use(cors());

// app.post('/customer', (req, res) =>{
//     res.send('customer');
// });

io.on('connection', (socket) => {
    // console.log('userType: ',socket.handshake.query.userType);
    console.log('User Connected');
    console.log('id ', socket.id, io.sockets.id);

    socket.emit('welcome', 'Welcome to the Socket.io Server!!!!!')

    Object.keys(io.sockets.sockets).forEach(function(id) {
        console.log("ID:",id)  // socketId
    })

    socket.on('customer-status', (cs) =>{
        console.log('customer-status ', cs);
        io.emit("customer-online", cs);
    });

    socket.on('partner-status', (ps) =>{
        console.log('partner-status ', ps);
        io.emit("partner-online", ps);
    });

    socket.on('chat message', (msg) =>{
        console.log('chat message ', msg);
        io.emit("received-message", msg);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);
    })
});


const port = 3000;

server.listen(port, () => {
    console.log(`Server is Started and Running on port ${port}`);
});