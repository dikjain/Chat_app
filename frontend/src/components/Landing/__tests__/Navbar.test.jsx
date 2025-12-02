import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

// Mock logo import
vi.mock('../../../assets/logo.png', () => 'logo.png');

describe('Navbar Component', () => {
  it('renders logo and app name', () => {
    render(<Navbar />);
    expect(screen.getByText('Chat-ly')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    render(<Navbar />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<Navbar />);
    const navbar = container.firstChild;
    expect(navbar.className).toContain('h-16');
    expect(navbar.className).toContain('flex');
  });
});

