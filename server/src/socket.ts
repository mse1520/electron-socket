import { Server, Socket } from 'socket.io';

export const updateUser = async (io: Server, socket: Socket) => {
  const sockets = await io.fetchSockets();
  socket.emit('connect_user', sockets.map(socket => {
    if (!(socket instanceof Socket)) return;
    return socket.request.session.user;
  }));

  socket.on('disconnect', () => {
    socket.emit('disconnect_user', socket.request.session.user);
  });
};

export const group = async (io: Server, socket: Socket) => {
  socket.on('join', () => {
    socket.join('group');
  });

  socket.on('leave', () => {
    socket.leave('group');
  });
};