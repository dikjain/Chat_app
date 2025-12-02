import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('displays loading state', () => {
    render(<Button loading loadingText="Loading...">Click Me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies primary variant styles', () => {
    const { container } = render(<Button variant="primary">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('bg-gradient-to-t');
  });

  it('applies white variant styles', () => {
    const { container } = render(<Button variant="white">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('bg-white');
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Click Me</Button>);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

