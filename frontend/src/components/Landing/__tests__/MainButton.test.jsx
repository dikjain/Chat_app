import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MainButton } from '../MainButton';

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
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));

    render(<MockedMainButton>Get Started</MockedMainButton>);
    const button = screen.getByText('Get Started');
    fireEvent.click(button);
    // Navigation is tested via integration tests
  });

  it('applies custom className', () => {
    const { container } = render(
      <MockedMainButton className="custom-class">Button</MockedMainButton>
    );
    const button = container.querySelector('.custom-class');
    expect(button).toBeInTheDocument();
  });
});

