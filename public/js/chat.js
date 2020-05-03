const socketio = io();

document.querySelector('#chat-form').addEventListener('submit',(e) => {
    e.preventDefault();
    const msg = e.target.elements.txtmsg.value;
    socketio.emit('sentMessage',msg);
})

socketio.on('receivedMsg',(updatedMessage) => {
    console.log(updatedMessage)
})