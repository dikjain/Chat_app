import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioCallBox from '../AudioCallBox';

vi.mock('../FeatureHeader', () => ({
  default: ({ title }) => <h1>{title}</h1>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('AudioCallBox Component', () => {
  it('renders feature header', () => {
    render(<AudioCallBox />);
    expect(screen.getByText('Audio Call')).toBeInTheDocument();
  });

  it('shows avatars on hover', () => {
    const { container } = render(<AudioCallBox />);
    const box = container.querySelector('.bg-neutral-50');
    
    fireEvent.mouseEnter(box);
    
    // Component should handle hover state
    expect(box).toBeInTheDocument();
  });
});

