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

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }
    navigator.geolocation.getCurrentPosition(position => {
        // console.log(position)
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', location)
    })
})