import axios from 'axios';
import './index.css';

const serverAxios = axios.create({ baseURL: 'http://localhost:3000' });

document.querySelector('#login').addEventListener('submit', async e => {
  e.preventDefault();
  if (!(e.target instanceof HTMLFormElement)) return;

  const data = Object.fromEntries(new FormData(e.target));
  console.log(data)

  try {
    const test = await window.api.login(data);
    // const res = await serverAxios.post('/login', data);
    // console.log(res.headers['set-cookie'])
    // const session = await serverAxios.get('/user').then(res => res.data);

    // console.log(result);
    // console.log(session);
  } catch (err) {
    alert('로그인 실패.');
  }
});

document.querySelector('#test').addEventListener('click', async e => {
  try {
    const session = await serverAxios.get('/user').then(res => res.data);

    // console.log(result);
    console.log(session);
  } catch (err) {
    alert('로그인 실패.');
  }
});