const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const moment = require('moment-timezone');

// Load environment variables from .env file
dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'https://chat-client-iota-beige.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight requests

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 3002;

const users = new Map();

app.get('/check-nickname', (req, res) => {
  const { nickname } = req.query;
  const nicknameExists = Array.from(users.values()).includes(nickname);
  res.json({ exists: nicknameExists });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (nickname) => {
    users.set(socket.id, nickname);
    io.emit('userList', Array.from(users.values()));
    socket.broadcast.emit('message', {
      sender: 'Server',
      message: `${nickname} has joined the chat`,
      time: moment().tz('Asia/Manila').format('hh:mm A') // Philippine time
    });
  });

  socket.on('sendMessage', (message) => {
    const sender = users.get(socket.id);
    io.emit('message', {
      sender,
      message,
      time: moment().tz('Asia/Manila').format('hh:mm A') // Philippine time
    });
  });

  socket.on('disconnect', () => {
    const nickname = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userList', Array.from(users.values()));
    socket.broadcast.emit('message', {
      sender: 'Server',
      message: `${nickname} has left the chat`,
      time: moment().tz('Asia/Manila').format('hh:mm A') // Philippine time
    });
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
