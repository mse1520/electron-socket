import session = require('express-session');

declare module 'http' {
  interface IncomingMessage {
    session: session.Session & Partial<session.SessionData> & { user: Express.User };
  }
}