import axios from 'axios';
import './index.css';
import { io, Socket } from 'socket.io-client';

interface User {
  username: string;
  nickname: string;
}

const serverAxios = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true });
const userInfoEl = document.querySelector('#user-info');
const tbodyEl = document.querySelector('table tbody');

let socket: Socket | null = null;

document.querySelector('#login').addEventListener('submit', async e => {
  e.preventDefault();
  if (!(e.target instanceof HTMLFormElement)) return;

  try {
    const data = Object.fromEntries(new FormData(e.target));
    const result = await serverAxios.post<User>('/login', data).then(res => res.data);

    if (socket) socket.disconnect();

    socket = io('http://localhost:3000', { withCredentials: true });

    socket.on('connect_user', (users: User[]) => {
      users.forEach(user => {
        const stateEl = document.querySelector(`#${user.username}`).querySelector('.state');
        if (!(stateEl instanceof HTMLTableCellElement)) return;
        stateEl.innerText = '로그인';
      });
    });

    socket.on('disconnect_user', user => {
      const stateEl = document.querySelector(`#${user.username}`).querySelector('.state');
      if (!(stateEl instanceof HTMLTableCellElement)) return;
      stateEl.innerText = '로그아웃';
    });

    if (!(userInfoEl instanceof HTMLDivElement)) return;
    userInfoEl.innerHTML = `
      <div>${result.nickname}님이 로그인하셧습니다.</div>
      <button id='logout' type='button'>로그아웃</button>
    `;
  } catch (err) {
    alert('로그인 실패.');
  }
});

userInfoEl.addEventListener('click', async e => {
  if (e.target !== document.querySelector('#logout')) return;

  try {
    await serverAxios.delete<User>('/logout').then(res => res.data);
    if (!(userInfoEl instanceof HTMLDivElement)) return;
    userInfoEl.innerHTML = '';
  } catch (err) {
    alert('로그인 실패.');
  }
});

tbodyEl.addEventListener('click', e => {
  if (!(e.target instanceof HTMLButtonElement)) return;

  if (e.target.classList.contains('join')) return socket.emit('join');
  socket.emit('leave');
});

document.querySelector('#test').addEventListener('click', async () => {
  try {
    const session = await serverAxios.get<User>('/session').then(res => res.data);
    console.log(session);
  } catch (err) {
    alert('로그인 실패.');
  }
});

serverAxios.get<User[]>('/user')
  .then(res => res.data)
  .then(users => users.map(user => `
    <tr id='${user.username}'>
      <td>${user.username}</td>
      <td>${user.nickname}</td>
      <td class='state'>로그아웃</td>
      <td><button class='join' type='button'>초대</button></td>
      <td><button class='leave' type='button'>추방</button></td>
    </tr>`))
  .then(trs => trs.join(''))
  .then(html => tbodyEl.innerHTML = html)

