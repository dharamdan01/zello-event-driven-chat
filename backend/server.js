import express from 'express';
import { createServer } from 'node:http';
import {Server} from "socket.io";

const app = express();
const server = createServer(app);
const ROOM = 'group';
const io = new Server(server, {cors: {origin: '*'}});

io.on('connection', (socket) => {
    // console.log('a user connected', socket.id);
    socket.on('joinRoom', async(userName) => {
      // console.log(`${userName} is joining the group.`);

      await socket.join(ROOM);

      // send to all users
      // io.to(ROOM).emit('roomNoticeForEveryone', userName);

      // broadcast only to other users in group except the one who joined the group.
      socket.to(ROOM).emit('userJoined', {userName});

      socket.on('sendChatMessage', (message) => {
        socket.to(ROOM).emit('sendChatMessage', message);
      })

      socket.on('typing', message => {
        socket.to(ROOM).emit('typing', message);
      });

    });

});

app.get('/', (req, res) => {
  res.send('<h1>Hello world zello app is uptodate</h1>');
});

server.listen(5500, () => {
  console.log('server running at http://localhost:5500');
});
