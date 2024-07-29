interface User {
  username: string;
  password: string;
  nickname: string;
}

const USERS: User[] = [
  { username: 'user1', password: '1234', nickname: '소연' },
  { username: 'user2', password: '1234', nickname: '미연' },
  { username: 'user3', password: '1234', nickname: '우기' },
  { username: 'user4', password: '1234', nickname: '민니' },
  { username: 'user5', password: '1234', nickname: '슈화' },
];

export const findAll = (): User[] => USERS;

export const findBy = (username: string): User | null => USERS.filter(user => user.username === username)?.[0] || null;