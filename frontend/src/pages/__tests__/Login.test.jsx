import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Login from '../Login';

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthProvider>
  );
};

import userEvent from '@testing-library/user-event';

describe('Login Component', () => {
  it('renders login form correctly', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('heading', { name: /З поверненням/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Увійти/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    const submitButton = screen.getByRole('button', { name: /Увійти/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email є обов'язковим/i)).toBeInTheDocument();
      expect(screen.getByText(/Пароль є обов'язковим/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Увійти/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Некоректний формат Email/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('successfully logs in', async () => {
    // We register a temporary user to login
    const randomEmail = `loginvitest${Math.floor(Math.random() * 10000)}@example.com`;
    try {
      await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Login Tester',
          email: randomEmail,
          password: 'password123',
          gender: 'M',
          date_of_birth: '2000-01-01'
        })
      });
    } catch (e) {
      console.error(e);
    }

    const user = userEvent.setup();
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Пароль/i);
    const submitButton = screen.getByRole('button', { name: /Увійти/i });

    await user.type(emailInput, randomEmail);
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // After success, it should call navigate('/') and so the Login component might unmount or do nothing observable directly here,
    // but we can just wait a bit to ensure the API call finishes.
    await waitFor(() => {
      expect(window.localStorage.getItem('access_token')).toBeTruthy();
    }, { timeout: 3000 });
  });
});
