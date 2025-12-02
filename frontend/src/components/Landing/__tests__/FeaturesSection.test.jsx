import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeaturesSection from '../FeaturesSection';

// Mock all feature components
vi.mock('../../Features/RealTimeMessagingBox', () => ({
  default: () => <div data-testid="realtime-messaging">RealTime</div>,
}));

vi.mock('../../Features/AudioCallBox', () => ({
  default: () => <div data-testid="audio-call">Audio</div>,
}));

vi.mock('../../Features/VideoCallBox', () => ({
  default: () => <div data-testid="video-call">Video</div>,
}));

vi.mock('../../Features/StoriesBox', () => ({
  default: () => <div data-testid="stories">Stories</div>,
}));

vi.mock('../../Features/LiveLocationBox', () => ({
  default: () => <div data-testid="live-location">Location</div>,
}));

vi.mock('../../Features/messageType', () => ({
  default: () => <div data-testid="message-type">Media</div>,
}));

vi.mock('../../Features/MultilingualBox', () => ({
  default: () => <div data-testid="multilingual">Translate</div>,
}));

describe('FeaturesSection Component', () => {
  it('renders all feature boxes', () => {
    render(<FeaturesSection />);
    expect(screen.getByTestId('realtime-messaging')).toBeInTheDocument();
    expect(screen.getByTestId('audio-call')).toBeInTheDocument();
    expect(screen.getByTestId('video-call')).toBeInTheDocument();
    expect(screen.getByTestId('stories')).toBeInTheDocument();
    expect(screen.getByTestId('live-location')).toBeInTheDocument();
    expect(screen.getByTestId('message-type')).toBeInTheDocument();
    expect(screen.getByTestId('multilingual')).toBeInTheDocument();
  });

  it('renders in grid layout', () => {
    const { container } = render(<FeaturesSection />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});

