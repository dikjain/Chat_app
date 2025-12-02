import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureHeader from '../FeatureHeader';

describe('FeatureHeader Component', () => {
  it('renders title and description', () => {
    render(
      <FeatureHeader
        title="Test Feature"
        description="Test description"
      />
    );
    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <FeatureHeader title="Test" description="Desc" />
    );
    const header = container.querySelector('.text-sm');
    expect(header).toBeInTheDocument();
  });
});

