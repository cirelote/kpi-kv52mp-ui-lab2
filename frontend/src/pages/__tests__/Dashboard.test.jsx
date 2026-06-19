import { describe, it, expect, beforeAll } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
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

describe('Dashboard Component', () => {
  beforeAll(async () => {
    const randomEmail = `dashvitest${Math.floor(Math.random() * 10000)}@example.com`;
    try {
      await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Dashboard Tester',
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
    renderWithProviders(<Dashboard />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders dashboard eventually', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Мої завдання/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('adds a new task and toggles it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Мої завдання/i })).toBeInTheDocument();
    }, { timeout: 3000 });

    const input = screen.getByPlaceholderText(/Що потрібно зробити\?/i);
    const addButton = screen.getByRole('button', { name: /Додати/i });

    const taskName = `Vitest Task ${Date.now()}`;
    await user.type(input, taskName);
    await user.click(addButton);

    // Verify task is added
    await waitFor(() => {
      expect(screen.getByText(taskName)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Find the task and toggle it
    const listItem = screen.getByText(taskName).closest('li');
    const checkbox = listItem.querySelector('input[type="checkbox"]');
    
    await user.click(checkbox);
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    }, { timeout: 3000 });

    // Delete the task
    const deleteBtn = listItem.querySelector('button[aria-label="delete"]');
    await user.click(deleteBtn);
    
    await waitFor(() => {
      expect(screen.queryByText(taskName)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
