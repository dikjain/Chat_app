import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ViewStatusModal from '../ViewStatusModal';

// Mock QueryClient
vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }) => children,
  useQuery: () => ({
    data: null,
    isLoading: false,
  }),
}));

// Mock dependencies
vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open }) => open ? <div data-testid="dialog">{children}</div> : null,
  Trigger: ({ children }) => <button>{children}</button>,
  Portal: ({ children }) => <div>{children}</div>,
  Overlay: () => <div data-testid="overlay" />,
  Content: ({ children }) => <div data-testid="content">{children}</div>,
  Title: ({ children }) => <h2>{children}</h2>,
  Close: () => <button>Close</button>,
}));

const mockStatus = {
  _id: 'status1',
  content: 'Test status',
  userId: { name: 'Test User', pic: 'pic.jpg' },
};

const MockedModal = (props) => (
  <BrowserRouter>
    <ViewStatusModal {...props} />
  </BrowserRouter>
);

describe('ViewStatusModal Component', () => {
  it('renders when open with status', () => {
    render(<MockedModal open={true} status={mockStatus} />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<MockedModal open={false} status={mockStatus} />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});

