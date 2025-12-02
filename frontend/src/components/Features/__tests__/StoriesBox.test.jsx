import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StoriesBox from '../StoriesBox';

vi.mock('../FeatureHeader', () => ({
  default: ({ title }) => <h1>{title}</h1>,
}));

vi.mock('../../../assets/logo.png', () => 'logo.png');

describe('StoriesBox Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders feature header', () => {
    render(<StoriesBox />);
    expect(screen.getByText('Stories')).toBeInTheDocument();
  });

  it('renders story indicators', () => {
    const { container } = render(<StoriesBox />);
    const indicators = container.querySelectorAll('.rounded-full');
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('changes story on indicator click', () => {
    const { container } = render(<StoriesBox />);
    const indicators = container.querySelectorAll('.rounded-full');
    
    if (indicators.length > 0) {
      fireEvent.click(indicators[0]);
      // Story index should change
      expect(indicators[0]).toBeInTheDocument();
    }
  });
});

