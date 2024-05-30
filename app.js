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

var customerID = [];
var partnerID = [];

io.on('connection', (socket) => {
    console.log(socket.handshake.query.userType);
    console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[');
    if(customerID.length > 0 && customerID != ''){
        socket.emit('customer online', 'Customer Online');
        console.log('customerID if Online',customerID);
        customerID.pop();
    }

    if(partnerID.length>0 && partnerID != ''){
        socket.emit('partner online', 'Partner Online')
        console.log('partnerID if Online',partnerID);
        partnerID.pop();
    }

    if(socket.handshake.query.userType == 'Customer Online'){
        customerID.push(socket.id);
        console.log('customerID after Pppppppppppuuuuuuushhhhhhhiiiiiiinnnnnngggggggg',customerID);
        socket.emit('customer online', 'Customer Online');
    }

    if(socket.handshake.query.userType == 'Partner Online'){
        partnerID.push(socket.id);
        console.log('partnerID after Pppppppuuuuuuushhhhhhhhhhiiiiiiiiiiinnnnnnnnnnggggggg',partnerID);
        socket.emit('partner online', 'Partner Online')
    }

    socket.emit('welcome', 'Welcome to the Socket.io Server!!!!!');

    socket.on('chat message', (msg) =>{
        console.log('chat message ', msg);
        if(msg.chatData[1] == customerID && partnerID != []){
            console.log('pppppppppppppppppppppppppppppppppppppppppppp');
            console.log(partnerID);
            console.log('pppppppppppppppppppppppppppppppppppppppppppp');
            socket.emit("received-message", msg.chatData[0]);
            // partnerID.emit("received-message", msg.chatData[0]);
        }
        if(msg.chatData[1] == partnerID && customerID != []){
            console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
            console.log(customerID);
            console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
            // customerID.emit("received-message", msg.chatData[0]);
            socket.emit("received-message", msg.chatData[0]);
        }
    });

    socket.on('customer-status', (co) =>{
        console.log('----------------------------------');
        console.log('Received Customer Status', co);
        console.log('----------------------------------');
        if(co == 'Customer Online')  io.emit('customer offline', 'Customer Offline');
        if(co == 'Customer Offline') io.emit('customer offline', 'Customer Offline');
    });

    socket.on('partner-status', (po) =>{
        console.log('____________________________________________________________')
            console.log('Received Partner Status', po);
            console.log('____________________________________________________________');
            if(po == 'Partner Online') io.emit('partner online', 'Partner Online');
            if(po == 'Partner Offline') io.emit('partner offline', 'Partner Offline');
    });

    socket.on('disconnect', () => {
        if(customerID.includes(socket.id)){
            console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
            console.log('On Customer App Destroyed Before Pop : ', customerID);
            io.emit('customer offline', 'Customer Offline');
            customerID.pop()
            console.log('On Customer App Destroyed After Pop:', customerID);
            console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
        }

        if(partnerID.includes(socket.id)){
            console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
            console.log('On Partner App Destroyed :', partnerID);
            io.emit('partner offline', 'Partner Offline');
            partnerID.pop()
            console.log('After Pop on Customer App Destroyed :', );
            console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
        }
        console.log('User Disconnected: ', socket.id);
    })
});


const port = 3000;

server.listen(port, () => {
    console.log(`Server is Started and Running on port ${port}`);
});