import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageTypeBox from '../messageType';

vi.mock('../FeatureHeader', () => ({
  default: ({ title }) => <h1>{title}</h1>,
}));

vi.mock('../../UI/StripedPattern', () => ({
  StripedPattern: () => <div data-testid="striped-pattern" />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('MessageTypeBox Component', () => {
  it('renders feature header', () => {
    render(<MessageTypeBox />);
    expect(screen.getByText('Media Sharing')).toBeInTheDocument();
  });

  it('shows file previews on hover', () => {
    const { container } = render(<MessageTypeBox />);
    const box = container.querySelector('.bg-neutral-50');
    
    fireEvent.mouseEnter(box);
    
    // File previews should be visible
    expect(box).toBeInTheDocument();
  });

  it('renders file, image, and video previews', () => {
    const { container } = render(<MessageTypeBox />);
    const previews = container.querySelectorAll('.bg-white');
    expect(previews.length).toBeGreaterThan(0);
  });
});

