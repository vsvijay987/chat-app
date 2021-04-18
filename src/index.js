const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express()
const server = http.createServer(app)
const io = socketio(server);
const Filter = require('bad-words');



const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');


io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.on('join', ( {username, room} ) => {

        socket.join(room);

        socket.emit('message', generateMessage('Welcome'));

        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))

    })

    socket.on('sendMessage', (value, callback) => {
        const filter = new Filter();

        if(filter.isProfane(value)){
            return callback('Profanity not allowed!')
        }

        io.emit('message', generateMessage(value))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left the chat!'))
    })

    socket.on('sendLocation', (coords, callback) => {
        const data = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        io.emit('LocationMessage', generateLocationMessage(data));
        // io.emit('message', data)
        callback()
    })
})

app.use(express.static(publicDirectoryPath));

server.listen(port, () => {
    console.log(`Server is up and running on ${port}!`)
})


