const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server);
const Filter = require('bad-words');



const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');


io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.on('join', ( options, callback ) => {

        const {error, user} = addUser({id: socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome'));

        socket.broadcast.to(user.room).emit('message', generateMessage(user.username, `${user.username} has joined`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();

    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', generateMessage(user.username, `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendMessage', (value, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if(filter.isProfane(value)){
            return callback('Profanity not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, value))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {

        const user = getUser(socket.id);
        const data = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`

        io.to(user.room).emit('LocationMessage', generateLocationMessage(user.username, data));
        callback()
    })

    
})

app.use(express.static(publicDirectoryPath));

server.listen(port, () => {
    console.log(`Server is up and running on ${port}!`)
})


