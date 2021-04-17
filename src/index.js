const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express()
const server = http.createServer(app)
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');


io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.emit('message', 'Welcome!');

    socket.on('sendMessage', (value) => {
        io.emit('message', value)
    })
})

app.use(express.static(publicDirectoryPath));

server.listen(port, () => {
    console.log(`Server is up and running on ${port}!`)
})


