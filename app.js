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
    console.log('id ', socket.id);

    socket.emit('welcome', 'Welcome to the Socket.io Server!!!!!')
    // io.emit('welcome', 'Welcome to the Socket.io Server!!!!!')

    var users = [{customer: '', partner: ''}]

    if(socket.handshake.query.userType == 'Customer'){
        users.customer = socket.handshake.query.userType;
    }

    if(socket.handshake.query.userType == 'Partner'){
        users.partner = socket.handshake.query.userType;
    }


    console.log('users : ', users.customer, users.partner);

    if(socket.handshake.query.userType == 'customer'){
        socket.emit('customer-online', 'Customer Online');
    }

    socket.on('customer', (c)=>{
        console.log('customer : ', c);
        socket.emit('customer-online', c);
    })

    socket.on('partner', (c)=>{
        console.log('partner : ', c);
        socket.emit('partner-online', c);
    })

    // if(socket.handshake.query.userType == 'Customer'){
    //     socket.emit('customer', 'Customer Online')

    // }else if(socket.handshake.query.userType == 'Partner'){
    //     socket.emit('partner', 'Partner Online')
    // }

    socket.on('chat message', (msg) =>{
        console.log('chat message ', msg);
        io.emit("received-message", msg);
    });

    socket.on('disconnect', () => {
        console.log('users : ', users.type);
        users.type.shift(socket.handshake.query.userType);

        console.log('User Disconnected: ', socket.id);
        // if(socket.handshake.query.userType == 'Customer'){
        //     socket.emit('customer', 'Customer Offline')
    
        // }else if(socket.handshake.query.userType == 'Partner'){
        //     socket.emit('partner', 'Partner Offline')
        // }
    })
});


const port = 3000;

server.listen(port, () => {
    console.log(`Server is Started and Running on port ${port}`);
});