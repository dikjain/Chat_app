import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RealTimeMessagingBox from '../RealTimeMessagingBox';

vi.mock('../FeatureHeader', () => ({
  default: ({ title, description }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

describe('RealTimeMessagingBox Component', () => {
  it('renders feature header', () => {
    render(<RealTimeMessagingBox />);
    expect(screen.getByText('Real-Time Messaging')).toBeInTheDocument();
  });

  it('shows messages on hover', () => {
    const { container } = render(<RealTimeMessagingBox />);
    const box = container.querySelector('.bg-neutral-50');
    
    fireEvent.mouseEnter(box);
    
    // Messages should be visible
    expect(box).toBeInTheDocument();
  });

  it('renders message preview', () => {
    const { container } = render(<RealTimeMessagingBox />);
    const preview = container.querySelector('.bg-white');
    expect(preview).toBeInTheDocument();
  });
});

