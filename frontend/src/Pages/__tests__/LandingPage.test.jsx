import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

// Mock all components
vi.mock('../../components/Landing/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('../../components/Landing/BackgroundLines', () => ({
  default: () => <div data-testid="background-lines">Background</div>,
}));

vi.mock('../../components/Landing/HeroSection', () => ({
  default: () => <section data-testid="hero">Hero</section>,
}));

vi.mock('../../components/Landing/FeaturesSection', () => ({
  default: () => <section data-testid="features">Features</section>,
}));

vi.mock('../../components/Landing/QuoteSection', () => ({
  default: () => <section data-testid="quote">Quote</section>,
}));

vi.mock('../../components/Landing/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

const MockedLandingPage = () => (
  <BrowserRouter>
    <LandingPage />
  </BrowserRouter>
);

describe('LandingPage Component', () => {
  it('renders all sections', () => {
    render(<MockedLandingPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('background-lines')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
    expect(screen.getByTestId('quote')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    const { container } = render(<MockedLandingPage />);
    const mainContainer = container.querySelector('.w-screen');
    expect(mainContainer).toBeInTheDocument();
  });
});

