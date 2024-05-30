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

var users = [];

io.on('connection', (socket) => {

    console.log(io.of('/').sockets.size);
    if(io.of('/').sockets.size == 0){
        users = []
    }
    // console.log('userType: ',socket.handshake.query.userType);
    // users[0] = socket.handshake.query.userType
    users.push(socket.handshake.query.userType);
    if(users[0].includes('Customer Online') || users[0].includes('Partner Online')){
        socket.emit('WhoOnline', `${users[0].includes('Customer Online')?users[0]:users[0].includes('Partner Online')?users[0]:''}`);
    }

    console.log('users ', users);
    console.log('User Connected');
    // console.log('id ', socket.id, io.sockets.id);

    socket.emit('welcome', 'Welcome to the Socket.io Server!!!!!')

    // Object.keys(io.sockets.sockets).forEach(function(id) {
    //     console.log("ID:",id)
    // })

    socket.on('customer-status', (cs) =>{
        console.log('customer-status ', cs);
        io.emit("customer-online", cs);
        if(cs == 'Customer Offline' && (users[0].includes('Customer Online'))){
            users.shift()
            console.log('after shift Customer : ', users);
            // socket.emit('WhoOnline', `${cs}`);
        }
        if(cs == 'Customer Offline' && users.includes('Customer Online')){
            users.pop()
            console.log('after pop Customer : ', users);
        }
    });

    socket.on('partner-status', (ps) =>{
        console.log('partner-status ', ps);
        io.emit("partner-online", ps);
        if(ps == 'Partner Offline' && (users[0].includes('Partner Online'))){
            users.shift()
            console.log('after shift partner: ', users);
            // socket.emit('WhoOnline', `${ps}`);
        }
        if(ps == 'Partner Offline' && users.includes('Partner Online')){
            users.pop()
            console.log('after pop partner : ', users);
        }
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




// ---------------------------------------------------------------------------------------
// Chat Application Code
// -------------------------------------------------------------------------------------------


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

var connections = {
    customer: [
        {
            status: '',
            id: ''
        }
    ],
    partner: [
        {
            status: '',
            id: ''
        }
    ]
}

var users = [];

io.on('connection', (socket) => {

    
    
    console.log('///////////////////////////////////////////////');
    console.log(connections);
    console.log(socket.handshake.query.userType);
    console.log('//////////////////////////////////////////////');

    if(socket.handshake.query.userType == 'Customer Online'){
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    console.log(connections);
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        connections.customer[0].status = socket.handshake.query.userType;
        connections.customer[0].id = socket.id;
        socket.emit('welcome', `Hello Customer Welcome! Your Partner is Offline. Please Wait.....`);
    }else{
        connections.partner[0].status = socket.handshake.query.userType;
        connections.partner[0].id = socket.id;
        socket.emit('welcome', `Hello Customer Welcome! Your Partner is Offline. Please Wait.....`);
    }

    console.log('*************************************');
    console.log(connections);
    console.log('**************************************');

    users.push(socket.handshake.query.userType);
    if(users[0].includes('Customer Online') || users[0].includes('Partner Online')){
        socket.emit('WhoOnline', `${users[0].includes('Customer Online')?users[0]:users[0].includes('Partner Online')?users[0]:''}`);
    }

    io.emit('ioevent', `Event from IO !!!!!!!!!!!!!!!`);

    // console.log('users ', users);
    console.log('User Connected');
    // console.log('id ', socket.id, io.sockets.id);

    // Object.keys(io.sockets.sockets).forEach(function(id) {
    //     console.log("ID:",id)
    // })

    socket.on('customer-status', (cs) =>{
        console.log('customer-status ', cs);
        io.emit("customer-online", cs);
        if(cs == 'Customer Offline' && (users[0].includes('Customer Online'))){
            users.shift()
            console.log('after shift Customer : ', users);
            // socket.emit('WhoOnline', `${cs}`);
        }
        if(cs == 'Customer Offline' && users.includes('Customer Online')){
            users.pop()
            console.log('after pop Customer : ', users);
        }
    });

    socket.on('partner-status', (ps) =>{
        console.log('partner-status ', ps);
        io.emit("partner-online", ps);
        if(ps == 'Partner Offline' && (users[0].includes('Partner Online'))){
            users.shift()
            console.log('after shift partner: ', users);
            // socket.emit('WhoOnline', `${ps}`);
        }
        if(ps == 'Partner Offline' && users.includes('Partner Online')){
            users.pop()
            console.log('after pop partner : ', users);
        }
    });

    socket.on('chat message', (msg) =>{
        console.log('chat message ', msg);
        io.emit("received-message", msg);
    });

    socket.on('disconnect', (d) => {
        if(socket.id == connections.customer[0].id){
            connections.customer[0].status = 'Customer Offline'
            connections.customer[0].id = ''
            socket.emit('welcome', `Customer Offline`);
        }
        if(socket.id == connections.partner[0].id){
            connections.partner[0].status = 'Partner Offline'
            connections.partner[0].id = ''
            socket.emit('welcome', `Customer Offline`);
        }
        console.log('------------------------------------------');
        console.log(connections);
        console.log('------------------------------------------');
        console.log('User Disconnected: ', socket.id, 'dddd :  ', d);
    })
});


const port = 3000;

server.listen(port, () => {
    console.log(`Server is Started and Running on port ${port}`);
});
