import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock logo and icons
vi.mock('../../../assets/logo.png', () => 'logo.png');
vi.mock('react-icons/fa', () => ({
  FaGithub: () => <div data-testid="github-icon">GitHub</div>,
  FaLinkedin: () => <div data-testid="linkedin-icon">LinkedIn</div>,
}));
vi.mock('react-icons/fa6', () => ({
  FaXTwitter: () => <div data-testid="twitter-icon">Twitter</div>,
}));

describe('Footer Component', () => {
  it('renders app name and logo', () => {
    render(<Footer />);
    expect(screen.getByText('Chat-ly')).toBeInTheDocument();
    expect(screen.getByAltText('Company Logo')).toBeInTheDocument();
  });

  it('renders footer link sections', () => {
    render(<Footer />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© \d{4} Chat-ly/i)).toBeInTheDocument();
  });
});

