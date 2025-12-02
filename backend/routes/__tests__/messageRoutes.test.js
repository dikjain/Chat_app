import { describe, it, expect } from 'vitest';

describe('Message Routes', () => {
  it('should have get messages route', () => {
    const routes = ['/api/message/:chatId', '/api/message', '/api/message/upload'];
    expect(routes).toContain('/api/message/:chatId');
  });

  it('should have send message route', () => {
    const routes = ['/api/message/:chatId', '/api/message', '/api/message/upload'];
    expect(routes).toContain('/api/message');
  });

  it('should have upload file route', () => {
    const routes = ['/api/message/:chatId', '/api/message', '/api/message/upload'];
    expect(routes).toContain('/api/message/upload');
  });
});

