import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input id="test-input" label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders input without label', () => {
    render(<Input id="test-input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<Input id="test-input" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const handleChange = vi.fn();
    render(<Input id="test-input" onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows password toggle button when showPasswordToggle is true', () => {
    render(<Input id="test-input" type="password" showPasswordToggle />);
    expect(screen.getByText('Show')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<Input id="test-input" type="password" showPasswordToggle />);
    const toggleButton = screen.getByText('Show');
    fireEvent.click(toggleButton);
    expect(screen.getByText('Hide')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Input id="test-input" className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

