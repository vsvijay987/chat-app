const socket = io();

socket.on('message', (text) => {
    console.log(text)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {

        if(error){
            return console.log(error)
        }
        console.log('Message Delivered!')
    })
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
        socket.emit('sendLocation', location, () => {
            console.log('Location shared!')
        })
    })
})