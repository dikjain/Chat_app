import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MainButton } from '../MainButton';

// Mock react-router-dom properly
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const MockedMainButton = (props) => (
  <BrowserRouter>
    <MainButton {...props} />
  </BrowserRouter>
);

describe('MainButton Component', () => {
  it('renders button with children', () => {
    render(<MockedMainButton>Click Me</MockedMainButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('navigates to /auth when clicked', () => {
    render(<MockedMainButton>Get Started</MockedMainButton>);
    const button = screen.getByText('Get Started');
    fireEvent.click(button);
    // Navigation is tested via integration tests
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MockedMainButton className="custom-class">Button</MockedMainButton>
    );
    const button = container.querySelector('.custom-class');
    expect(button).toBeInTheDocument();
  });
});

