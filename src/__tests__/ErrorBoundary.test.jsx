import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock error reporting
const mockReportError = vi.fn();
vi.mock('../utils/errorReporting', () => ({
  reportError: mockReportError,
}));

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error during tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('renders children when there is no error', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('catches errors and displays error fallback', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/We encountered an unexpected error/)
    ).toBeInTheDocument();
  });

  it('shows try again button', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('shows go home and refresh buttons', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    // Mock development environment
    const originalEnv = import.meta.env;
    Object.defineProperty(import.meta, 'env', {
      value: { ...originalEnv, DEV: true },
      writable: true,
    });

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error details toggle in dev mode
    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();

    // Restore original env
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
    });
  });

  it('handles error details expansion', () => {
    // Mock development environment
    const originalEnv = import.meta.env;
    Object.defineProperty(import.meta, 'env', {
      value: { ...originalEnv, DEV: true },
      writable: true,
    });

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const detailsButton = screen.getByText('Error Details (Development)');
    fireEvent.click(detailsButton);

    expect(screen.getByText('Error Message:')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    // Restore original env
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
    });
  });

  it('handles copy error functionality', () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(),
      },
    });

    const originalEnv = import.meta.env;
    Object.defineProperty(import.meta, 'env', {
      value: { ...originalEnv, DEV: true },
      writable: true,
    });

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Expand error details
    const detailsButton = screen.getByText('Error Details (Development)');
    fireEvent.click(detailsButton);

    const copyButton = screen.getByText('Copy Error');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Restore original env
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
    });
  });

  it('has proper accessibility attributes', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Check for proper button roles
    expect(
      screen.getByRole('button', { name: 'Try Again' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Refresh Page' })
    ).toBeInTheDocument();
  });
});
