// apps/chat-server/src/index.ts

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const PORT = process.env.PORT || 3002;

const users = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (nickname) => {
    users.set(socket.id, nickname);
    io.emit('userList', Array.from(users.values()));
    socket.broadcast.emit('message', {
      sender: 'Server',
      message: `${nickname} has joined the chat`,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('sendMessage', (message) => {
    const sender = users.get(socket.id);
    io.emit('message', {
      sender,
      message,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    const nickname = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userList', Array.from(users.values()));
    socket.broadcast.emit('message', {
      sender: 'Server',
      message: `${nickname} has left the chat`,
      time: new Date().toLocaleTimeString()
    });
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
