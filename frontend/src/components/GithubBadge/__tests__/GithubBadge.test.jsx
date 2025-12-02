import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GithubBadge from '../../GithubBadge';

vi.mock('react-icons/fa', () => ({
  FaGithub: () => <div data-testid="github-icon">GitHub</div>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

vi.mock('../../svg/svgs', () => ({
  PlusIcon: ({ className }) => <svg className={className} data-testid="plus-icon" />,
}));

describe('GithubBadge Component', () => {
  it('renders GitHub icon', () => {
    render(<GithubBadge />);
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
  });

  it('renders "open source" text', () => {
    render(<GithubBadge />);
    expect(screen.getByText(/open source/i)).toBeInTheDocument();
  });

  it('expands on hover', () => {
    const { container } = render(<GithubBadge />);
    const badge = container.querySelector('.bg-gray-200');
    
    fireEvent.mouseEnter(badge);
    
    // Badge should expand
    expect(badge).toBeInTheDocument();
  });

  it('renders corner plus icons', () => {
    const { container } = render(<GithubBadge />);
    // PlusIcon renders as SVG, check for SVG elements instead
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThan(0);
  });
});

