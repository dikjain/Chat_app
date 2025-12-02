import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from '../HeroSection';

vi.mock('../MainButton', () => ({
  MainButton: ({ children }) => <button>{children}</button>,
}));

vi.mock('../../GithubBadge', () => ({
  default: () => <div data-testid="github-badge">GitHub Badge</div>,
}));

const MockedHeroSection = () => (
  <BrowserRouter>
    <HeroSection />
  </BrowserRouter>
);

describe('HeroSection Component', () => {
  it('renders hero heading', () => {
    render(<MockedHeroSection />);
    expect(screen.getByText(/better way to talk/i)).toBeInTheDocument();
  });

  it('renders GitHub badge', () => {
    render(<MockedHeroSection />);
    expect(screen.getByTestId('github-badge')).toBeInTheDocument();
  });

  it('renders main button', () => {
    render(<MockedHeroSection />);
    expect(screen.getByText(/try chat-ly/i)).toBeInTheDocument();
  });

  it('renders hero image', () => {
    const { container } = render(<MockedHeroSection />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });
});

