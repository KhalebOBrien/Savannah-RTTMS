import { vi } from "vitest";

const jwt = {
  sign: vi.fn(() => 'fake-jwt-token'),
  verify: vi.fn(() => ({ userId: 'mock-user-id' })),
};

export default jwt;

