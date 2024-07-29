import express from 'express';
import { UserForm } from './types';
import { login, logout } from './service';
import { Server } from 'socket.io';
import { findAll } from './user.repository';

const router = express.Router();

router.get('/user', (req, res) => {
  res.json(findAll());
});

router.get('/session', (req, res) => {
  res.json(req.session.user);
});

router.post('/login', async (req, res) => {
  const user: UserForm = req.body;

  try {
    const result = await login(user, req.session);
    if (result.code === 401) return res.status(401).json(result.data);
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/logout', async (req, res) => {
  const io: Server = req.app.get('io');

  try {
    const result = await logout(req.session, io);
    result.code === 200
      ? res.json(result.data)
      : res.status(500).json(result.data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;