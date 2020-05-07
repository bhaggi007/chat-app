const socketio = io();

// Elements
const $messageForm = document.querySelector('#chat-form');
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

// Options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Get height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    
    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight -newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socketio.on('message', (updatedMessage) => {
    console.log(updatedMessage)
    const html = Mustache.render(messageTemplate,{
        username: updatedMessage.username,
        message:updatedMessage.text,
        createdAt: moment(updatedMessage.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})

socketio.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationTemplate,{
        username: location.username,
        location:location.location,
        createdAt: moment(location.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socketio.on('roomData',({room,users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // disable
    $messageFormButton.setAttribute('disabled', 'disabled')
    const msg = e.target.elements.txtmsg.value;
    socketio.emit('sentMessage', msg, (error) => {
        // enable button
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log('The message was delivered!');

    });
})


$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    } $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {

        socketio.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
       // console.log(position)
    })
})

socketio.emit('join',{username,room},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})