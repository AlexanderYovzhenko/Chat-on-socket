const express = require("express");
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', (_, res) => {
	res.render('index')
});

const PORT = process.env.PORT || 3000;

server = app.listen(PORT, '0.0.0.0', () => console.info("Server is running..."));

const io = require('socket.io')(server, {
    cors: {
        // origin: "0.0.0.0",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

const arrayMessages = [];
let roomUsers;

io.on('connection', (socket) => {
	console.log('New user connected')

    socket.on('create', (room) => {
      roomUsers = room;
    });

	socket.username = "Anonymous";

    socket.on('change_username', (data) => {
        socket.username = data.username
    });

    socket.on('new_message', (data) => {
        arrayMessages.push(`${socket.username}: ${data.message} `);
        io.sockets.emit('add_mess', {roomUsers, arrayMessages, message : data.message, username : socket.username, className : data.className});
    });

    socket.on('typing', (_) => {
    	socket.broadcast.emit('typing', {roomUsers, username : socket.username})
    });
});
