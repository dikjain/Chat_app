import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StripedPattern } from '../StripedPattern';

describe('StripedPattern Component', () => {
  it('renders SVG pattern', () => {
    const { container } = render(<StripedPattern />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<StripedPattern className="custom-class" />);
    const svg = container.querySelector('.custom-class');
    expect(svg).toBeInTheDocument();
  });

  it('renders with left direction by default', () => {
    const { container } = render(<StripedPattern />);
    const pattern = container.querySelector('pattern');
    expect(pattern).toBeInTheDocument();
  });

  it('renders with right direction', () => {
    const { container } = render(<StripedPattern direction="right" />);
    const pattern = container.querySelector('pattern');
    expect(pattern).toBeInTheDocument();
  });
});

