const socket = io();

socket.on('message', (text) => {
    console.log(text)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('clicked')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})