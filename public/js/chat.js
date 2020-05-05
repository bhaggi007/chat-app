const socketio = io();

// Elements
const $messageForm = document.querySelector('#chat-form');
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

socketio.on('message',(updatedMessage) => {
    console.log(updatedMessage)
})


$messageForm.addEventListener('submit',(e) => {
    e.preventDefault();
    // disable
    $messageFormButton.setAttribute('disabled','disabled')
    const msg = e.target.elements.txtmsg.value;
    socketio.emit('sentMessage',msg,(error) => {
        // enable button
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if(error){
            return console.log(error);
        }
        console.log('The message was delivered!');

    });
})


$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    } $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
       
        socketio.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
        console.log(position)
    })
})