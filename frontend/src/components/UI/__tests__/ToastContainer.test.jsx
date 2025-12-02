import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ToastContainer from '../ToastContainer';

describe('ToastContainer Component', () => {
  const mockToasts = [
    {
      id: 1,
      title: 'Success',
      description: 'Operation successful',
      status: 'success',
    },
    {
      id: 2,
      title: 'Error',
      description: 'Operation failed',
      status: 'error',
    },
  ];

  const mockRemoveToast = vi.fn();

  it('renders all toasts', () => {
    render(
      <ToastContainer toasts={mockToasts} removeToast={mockRemoveToast} />
    );
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders toast descriptions', () => {
    render(
      <ToastContainer toasts={mockToasts} removeToast={mockRemoveToast} />
    );
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    expect(screen.getByText('Operation failed')).toBeInTheDocument();
  });

  it('calls removeToast when close button is clicked', () => {
    render(
      <ToastContainer toasts={mockToasts} removeToast={mockRemoveToast} />
    );
    const closeButtons = screen.getAllByText('×');
    fireEvent.click(closeButtons[0]);
    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });

  it('applies correct status colors', () => {
    const { container } = render(
      <ToastContainer toasts={mockToasts} removeToast={mockRemoveToast} />
    );
    const successToast = container.querySelector('.bg-green-500');
    const errorToast = container.querySelector('.bg-gray-800');
    expect(successToast).toBeInTheDocument();
    expect(errorToast).toBeInTheDocument();
  });

  it('renders empty when no toasts', () => {
    render(<ToastContainer toasts={[]} removeToast={mockRemoveToast} />);
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });
});

