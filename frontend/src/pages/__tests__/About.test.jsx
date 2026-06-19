import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import About from '../About';

describe('About Component', () => {
  it('renders loading state initially', () => {
    render(<About />);
    // CircularProgress renders a progressbar role by default in MUI
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders about content eventually', async () => {
    render(<About />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Про додаток/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
