const socket =io();

document.querySelector('#msgForm').addEventListener('submit',(e) => {
    e.preventDefault();
    const message = e.target.elements.message.value
    socket.emit('sentMessage',message);
   
})
socket.on('updatedMsg',(me) => {
    console.log(`Message is: ${me}`)
})