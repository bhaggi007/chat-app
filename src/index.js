const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const { generateMessage,generateLocationMessage } = require('./utils/messages')


const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicpath = path.join(__dirname, '../public')

io.on('connection', (socket) => {
    console.log('New client connected to socket io')
    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('A new user has joined'));
    socket.on('sentMessage', (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed');
        }
        io.emit('message', generateMessage(message));
        callback();
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
    socket.on('sendLocation', (location, callback) => {

        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback();
    })
})

app.use(express.static(publicpath));

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})