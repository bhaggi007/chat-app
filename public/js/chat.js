const socketio = io();

document.querySelector('#chat-form').addEventListener('submit',(e) => {
    e.preventDefault();
    const msg = e.target.elements.txtmsg.value;
    socketio.emit('sentMessage',msg,(error) => {
        if(error){
            return console.log(error);
        }
        console.log('The message was delivered!');

    });
})

socketio.on('message',(updatedMessage) => {
    console.log(updatedMessage)
})

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socketio.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log('Location shared!')
        })
        console.log(position)
    })
})