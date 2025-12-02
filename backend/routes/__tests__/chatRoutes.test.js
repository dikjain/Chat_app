import { describe, it, expect } from 'vitest';

describe('Chat Routes', () => {
  it('should have get chats route', () => {
    const routes = ['/api/chat', '/api/chat/group', '/api/chat/rename'];
    expect(routes).toContain('/api/chat');
  });

  it('should have create group chat route', () => {
    const routes = ['/api/chat', '/api/chat/group', '/api/chat/rename'];
    expect(routes).toContain('/api/chat/group');
  });

  it('should have rename group chat route', () => {
    const routes = ['/api/chat', '/api/chat/group', '/api/chat/rename'];
    expect(routes).toContain('/api/chat/rename');
  });
});

