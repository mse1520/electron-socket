import express from 'express';

const USERS: Express.User[] = [
  { username: 'user1', password: '1234', nickname: '소연' },
  { username: 'user2', password: '1234', nickname: '미연' },
  { username: 'user3', password: '1234', nickname: '우기' },
  { username: 'user4', password: '1234', nickname: '민니' },
  { username: 'user5', password: '1234', nickname: '슈화' },
];

const findBy = (username: string): Express.User | null => USERS.filter(user => user.username === username)?.[0] || null;

const router = express.Router();

router.get('/user', (req, res) => {
  console.log(req.session)
  res.status(200).json(req.session.user);
});

router.post('/login', (req, res, next) => {
  const user: Express.User = req.body;
  const findUser = findBy(user.username);

  if (!findUser) return res.status(401).json({ message: '로그인 실패' });
  if (findUser.password !== user.password) return res.status(401).json({ message: '로그인 실패' });

  req.session.user = findUser;
  req.session.save(err => {
    if (err) return next(err);
    res.status(200).json(findUser);
  });
});


export default router;