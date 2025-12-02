import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import VideoCallBox from '../VideoCallBox';

vi.mock('../FeatureHeader', () => ({
  default: ({ title }) => <h1>{title}</h1>,
}));

vi.mock('../Authentication/PixelBlast', () => ({
  default: () => <div data-testid="pixel-blast">PixelBlast</div>,
}));

describe('VideoCallBox Component', () => {
  it('renders feature header', () => {
    render(<VideoCallBox />);
    expect(screen.getByText('Video Call')).toBeInTheDocument();
  });

  it('renders video previews', () => {
    const { container } = render(<VideoCallBox />);
    const previews = container.querySelectorAll('.bg-white');
    expect(previews.length).toBeGreaterThan(0);
  });
});

