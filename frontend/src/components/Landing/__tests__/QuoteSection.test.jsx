import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuoteSection from '../QuoteSection';

vi.mock('../../Noise', () => ({
  default: () => <div data-testid="noise">Noise</div>,
}));

vi.mock('../../svg/svgs', () => ({
  PlusIcon: ({ className }) => <svg className={className} data-testid="plus-icon" />,
}));

describe('QuoteSection Component', () => {
  it('renders quote text', () => {
    render(<QuoteSection />);
    // Text is split across elements, so check for parts
    expect(screen.getByText(/We ain't no/i)).toBeInTheDocument();
    expect(screen.getByText(/Nokia/i)).toBeInTheDocument();
  });

  it('renders noise effect', () => {
    render(<QuoteSection />);
    expect(screen.getByTestId('noise')).toBeInTheDocument();
  });

  it('renders corner plus icons', () => {
    const { container } = render(<QuoteSection />);
    // PlusIcon renders as SVG, check for SVG elements instead
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThan(0);
  });

  it('applies gradient background', () => {
    const { container } = render(<QuoteSection />);
    const gradient = container.querySelector('.bg-gradient-to-b');
    expect(gradient).toBeInTheDocument();
  });
});

