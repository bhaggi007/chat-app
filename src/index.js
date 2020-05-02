const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname,'../public')



app.use(express.static(publicDirectory));

io.on('connection',(socket)=>{
    console.log('New socket connection');
    socket.emit('welcomeMsg','Welcome!');

    socket.on('sentMessage',(msg) => {
        io.emit('updatedMsg',msg);
    })
})

server.listen(port, ()=>{
    console.log(`Chat app running on port: ${port}`);
})