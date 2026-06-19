import { describe, it, expect, beforeAll } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SharedTasks from '../SharedTasks';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('SharedTasks Component', () => {
  beforeAll(async () => {
    const randomEmail = `sharedvitest${Math.floor(Math.random() * 10000)}@example.com`;
    try {
      await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Shared Tester',
          email: randomEmail,
          password: 'password123',
          gender: 'M',
          date_of_birth: '2000-01-01'
        })
      });
      const res = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: randomEmail, password: 'password123' })
      });
      const data = await res.json();
      window.localStorage.setItem('access_token', data.access);
    } catch (e) {
      console.error(e);
    }
  });

  it('renders loading state initially', () => {
    renderWithProviders(<SharedTasks />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders shared tasks board eventually', async () => {
    renderWithProviders(<SharedTasks />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Shared Tasks Board/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('adds a new shared task', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SharedTasks />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Shared Tasks Board/i })).toBeInTheDocument();
    }, { timeout: 3000 });

    const input = screen.getByLabelText(/New Shared Task/i);
    const addButton = screen.getByRole('button', { name: /Add/i });

    const taskName = `Shared Vitest Task ${Date.now()}`;
    await user.type(input, taskName);
    await user.click(addButton);

    // Depending on WS implementation in tests, it may or may not show up instantly
    // but the input should be cleared if the API request was successful
    await waitFor(() => {
      expect(input).toHaveValue('');
    }, { timeout: 3000 });
  });
});
