const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage,generateLocationMessage } = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')


const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicpath = path.join(__dirname, '../public')

io.on('connection', (socket) => {
    console.log('New client connected to socket io')
    
    socket.on('join',({username,room},callback) => {
        const {error,user} = addUser({id: socket.id,username,room})
        if(error){
            return callback(error);
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`));
        callback();
    })


    socket.on('sentMessage', (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed');
        }
        io.to('Bangalore').emit('message', generateMessage(message));
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
        }
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