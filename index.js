

const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000;



app.use(express.static(path.join(__dirname, 'public')) )

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
   // res.status(500)
   })














// Node server which will handle socket io connections
const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })