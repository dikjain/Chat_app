import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileModal from '../ProfileModal';

// Mock Radix UI Dialog
vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open }) => open ? <div data-testid="dialog">{children}</div> : null,
  Trigger: ({ children }) => <button>{children}</button>,
  Portal: ({ children }) => <div>{children}</div>,
  Overlay: () => <div data-testid="overlay" />,
  Content: ({ children }) => <div data-testid="content">{children}</div>,
  Title: ({ children }) => <h2>{children}</h2>,
  Close: () => <button>Close</button>,
}));

const MockedModal = (props) => (
  <BrowserRouter>
    <ProfileModal {...props} />
  </BrowserRouter>
);

describe('ProfileModal Component', () => {
  it('renders when open', () => {
    render(<MockedModal open={true} />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<MockedModal open={false} />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});

