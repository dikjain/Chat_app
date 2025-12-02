import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LiveLocationBox from '../LiveLocationBox';

vi.mock('../FeatureHeader', () => ({
  default: ({ title }) => <h1>{title}</h1>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    g: ({ children }) => <g>{children}</g>,
    path: (props) => <path {...props} />,
  },
}));

describe('LiveLocationBox Component', () => {
  it('renders feature header', () => {
    render(<LiveLocationBox />);
    expect(screen.getByText('Live Location')).toBeInTheDocument();
  });

  it('renders map SVG', () => {
    const { container } = render(<LiveLocationBox />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows location marker', () => {
    const { container } = render(<LiveLocationBox />);
    const marker = container.querySelector('ellipse[fill="#4ade80"]');
    expect(marker).toBeInTheDocument();
  });
});

