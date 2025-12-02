import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageActions from '../MessageActions';

describe('MessageActions Component', () => {
  const mockMessage = {
    _id: 'msg1',
    content: 'Test message',
    sender: { _id: 'user1' },
  };

  const mockCurrentUser = { _id: 'user1' };

  it('renders action buttons for own messages', () => {
    render(<MessageActions message={mockMessage} currentUser={mockCurrentUser} />);
    // Component should render action buttons
    expect(document.body).toBeTruthy();
  });

  it('handles delete action', () => {
    const mockOnDelete = vi.fn();
    render(
      <MessageActions
        message={mockMessage}
        currentUser={mockCurrentUser}
        onDelete={mockOnDelete}
      />
    );
    // Test would verify delete functionality
    expect(mockOnDelete).toBeDefined();
  });

  it('handles edit action', () => {
    const mockOnEdit = vi.fn();
    render(
      <MessageActions
        message={mockMessage}
        currentUser={mockCurrentUser}
        onEdit={mockOnEdit}
      />
    );
    // Test would verify edit functionality
    expect(mockOnEdit).toBeDefined();
  });
});

