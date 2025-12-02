import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import BackgroundLines from '../BackgroundLines';

vi.mock('../../svg/svgs', () => ({
  PlusIcon: ({ className }) => <svg className={className} data-testid="plus-icon" />,
}));

describe('BackgroundLines Component', () => {
  it('renders background lines container', () => {
    const { container } = render(<BackgroundLines />);
    const linesContainer = container.querySelector('.absolute');
    expect(linesContainer).toBeInTheDocument();
  });

  it('renders horizontal lines', () => {
    const { container } = render(<BackgroundLines />);
    const horizontalLines = container.querySelectorAll('.h-px');
    expect(horizontalLines.length).toBeGreaterThan(0);
  });

  it('renders vertical lines', () => {
    const { container } = render(<BackgroundLines />);
    const verticalLines = container.querySelectorAll('.w-px');
    expect(verticalLines.length).toBeGreaterThan(0);
  });

  it('renders plus icons at corners', () => {
    const { container } = render(<BackgroundLines />);
    const plusIcons = container.querySelectorAll('[data-testid="plus-icon"]');
    expect(plusIcons.length).toBeGreaterThan(0);
  });
});

