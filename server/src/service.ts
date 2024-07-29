import { Session } from 'express-session';
import { UserForm } from './types';
import { findBy } from './user.repository';
import { Server } from 'socket.io';

interface SessionInfo {
  user?: Express.User;
}

export const login = async (user: UserForm, session: SessionInfo) => {
  const findUser = findBy(user.username);

  if (!findUser) return { code: 401, data: { message: '로그인 실패' } };
  if (findUser.password !== user.password) return { code: 401, data: { message: '로그인 실패' } };

  const data = {
    username: findUser.username,
    nickname: findUser.nickname,
  };
  session.user = data;
  return { code: 200, data };
};

export const logout = async (session: Session & SessionInfo, io: Server) => {
  io.emit('disconnect_user', session.user);
  io.in(session.id).disconnectSockets();
  const err = await new Promise(resolve => session.destroy(err => resolve(err)));
  if (err) return { code: 500, data: { message: err } };

  return { code: 200, data: { message: '로그아웃 성공.' } };
};

