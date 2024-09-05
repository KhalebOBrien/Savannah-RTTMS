import { vi } from 'vitest';

const bcrypt = {
  hash: vi.fn((password: string) => Promise.resolve(`hashed-${password}`)),
  compare: vi.fn((password: string, hashed: string) =>
    Promise.resolve(password === hashed.replace('hashed-', '')),
  ),
};

export default bcrypt;
