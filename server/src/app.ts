// import './configs/dotenvConfig';
import http from 'http';
import express, { NextFunction, Response } from 'express';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
});

app.set('io', io);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))
app.use(sessionMiddleware);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: unknown, res: Response, next: NextFunction) => {
  console.error('Error: ', err);
  res.status(500).send(err);
});

io.engine.use(sessionMiddleware);
io.on('connection', socket => {
  console.info('socket user connected: ', socket.id);
  // socket.join(socket.request.session.id);
});

server.listen(PORT, () => {
  console.info(`App listening on http://localhost:${PORT}`);
});