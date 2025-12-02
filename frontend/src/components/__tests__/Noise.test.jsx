import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import Noise from '../Noise';

describe('Noise Component', () => {
  beforeEach(() => {
    // Mock canvas context
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      createImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(100),
      })),
      putImageData: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders canvas element', () => {
    const { container } = render(<Noise />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    const { container } = render(<Noise />);
    const canvas = container.querySelector('canvas');
    expect(canvas.className).toContain('absolute');
    expect(canvas.className).toContain('inset-0');
  });

  it('accepts custom props', () => {
    const { container } = render(
      <Noise
        patternSize={250}
        patternAlpha={15}
        patternRefreshInterval={2}
      />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});

