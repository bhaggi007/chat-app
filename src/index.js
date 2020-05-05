const path = require("path");
const http =require("http");
const express = require("express");
const socketio = require("socket.io");


const port  = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicpath = path.join(__dirname,'../public')

io.on('connection',(socket)=>{
    console.log('New client connected to socket io')
    socket.emit('message','Welcome!')
    socket.broadcast.emit('message','A new user has joined');
    socket.on('sentMessage',(message) => {
        io.emit('message',message);
    })

    socket.on('disconnect',() => {
        io.emit('message','A user has left')
    })
})

app.use(express.static(publicpath));

server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})