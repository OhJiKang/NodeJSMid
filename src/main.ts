import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import Filter from 'bad-words';
import { ENV_CONFIG } from '@server/config';
import { createMessages, getUserList, addUser, removeUser, findUser } from '@server/utils';

const publicPathDirectory = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  // Thực hiện việc chia phòng khi nhận được query params từ client
  socket.on('join room', ({ room, username }) => {
    socket.join(room);
    socket.emit(
      'send msg server->client',
      createMessages(`Chào mừng đến với phòng ${room} mong bạn hãy quẩy hết mình và bay hết nấc nhé`, 'Từ Hệ thống Vui Vẻ Lầy Lội'),
    );
    socket.broadcast
      .to(room)
      .emit(
        'send msg server->client',
        createMessages(`${username} vừa nhảy vào phòng ${room} chung vui với chúng ta nè`, 'Từ Hệ thống Vui Vẻ Lầy Lội'),
      );

    socket.on('send msg client->server', (messageText, callback) => {
      const filter = new Filter();
      if (filter.isProfane(messageText)) {
        messageText = filter.clean(messageText);
      }
      const id = socket.id;
      const user = findUser(id);
      io.to(room).emit('send msg server->client', createMessages(messageText, user.username));
      callback();
    });

    // Add User
    const newUser = {
      id: socket.id,
      username,
      room,
    };
    addUser(newUser);

    // Handle UserList
    io.to(room).emit('send user from server->client', getUserList(room));
    socket.on('disconnect', () => {
      removeUser(socket.id);
      const id = socket.id;
      const user = findUser(id);
      io.to(room).emit('send user from server->client', getUserList(room));
      socket.to(room).emit('send msg server->client', createMessages(`${username} vừa rời khỏi phòng rồi.`, 'Từ Hệ thống Vui Vẻ Lầy Lội'));
    });
  });
});

server.listen(ENV_CONFIG.PORT, () => {
  console.log(`Listening on port: ${ENV_CONFIG.PORT}`);
});
