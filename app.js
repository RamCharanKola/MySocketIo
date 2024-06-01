import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, 
    {
    pingTimeout: Infinity,
    // connectionStateRecovery: {
    // maxDisconnectionDuration: Infinity,
    // skipMiddlewares: true,
    // },
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
    if (socket.recovered) {
        console.log('Connection Recovered ');
      } else {
        console.log('New Connection Established ');
      }
    console.log(socket.handshake.query.userType);
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
        console.log('After Pushing customerID : ',customerID);
        socket.emit('customer online', 'Customer Online');
    }

    if(socket.handshake.query.userType == 'Partner Online'){
        partnerID.push(socket.id);
        console.log('After Pushing partnerID : ',partnerID);
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
            socket.emit("received-message", msg.chatData[0], partnerID);
        }
        if(msg.chatData[1] == partnerID && customerID != []){
            console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
            console.log(customerID);
            console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
            socket.emit("received-message", msg.chatData[0], customerID);
        }
    });

    socket.on('customer-status', (co) =>{
        console.log('Received Customer Status', co);
        if(co == 'Customer Online')  io.emit('customer online', 'Customer Online');
        if(co == 'Customer Offline') {
            io.emit('customer offline', 'Customer Offline');
            customerID.pop()
        }
    });

    socket.on('partner-status', (po) =>{
            console.log('Received Partner Status', po);
            if(po == 'Partner Online') io.emit('partner online', 'Partner Online');
            if(po == 'Partner Offline') {
                io.emit('partner offline', 'Partner Offline');
                partnerID.pop()
            }
    });

    socket.on('disconnect', (reason) => {
        console.log('socket disconnected Reason : ', reason);
        if(customerID.includes(socket.id)){
            console.log('On Customer App Destroyed Before Pop : ', customerID);
            io.emit('customer offline', `Customer Offline`);
            customerID.pop()
            console.log('On Customer App Destroyed After Pop:', customerID);
        }

        if(partnerID.includes(socket.id)){
            console.log('On Partner App Destroyed :', partnerID);
            socket.emit('partner offline', `Partner Offline`);
            partnerID.pop()
            console.log('After Pop on Partner App Destroyed :', );
        }
        console.log('User Disconnected: ', socket.id);
    })
});


const port = 3000;

server.listen(port, () => {
    console.log(`Server is Started and Running on port ${port}`);
});