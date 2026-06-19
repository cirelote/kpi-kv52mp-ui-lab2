import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Register from '../Register';

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

describe('Register Component', () => {
  it('renders register form correctly', () => {
    renderWithProviders(<Register />);
    expect(screen.getByRole('heading', { name: /Створити акаунт/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Ім'я/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Зареєструватися/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    const submitButton = screen.getByRole('button', { name: /Зареєструватися/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Ім'я є обов'язковим/i)).toBeInTheDocument();
      expect(screen.getByText(/Email є обов'язковим/i)).toBeInTheDocument();
      expect(screen.getByText(/Пароль є обов'язковим/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short name and short password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    
    await user.type(screen.getByLabelText(/Ім'я/i), 'A');
    await user.type(screen.getByLabelText(/Email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/Пароль/i), '123');
    
    const submitButton = screen.getByRole('button', { name: /Зареєструватися/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Ім'я занадто коротке/i)).toBeInTheDocument();
      expect(screen.getByText(/Мінімум 6 символів/i)).toBeInTheDocument();
    });
  });

  it('successfully registers a user', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    
    const randomEmail = `regvitest${Math.floor(Math.random() * 10000)}@example.com`;
    await user.type(screen.getByLabelText(/Ім'я/i), 'Valid Name');
    await user.type(screen.getByLabelText(/Email/i), randomEmail);
    await user.type(screen.getByLabelText(/Пароль/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /Зареєструватися/i });
    
    // Mock window.alert to prevent blocking test if alert happens
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    await user.click(submitButton);

    // If it succeeds, it alerts and navigates.
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
    }, { timeout: 3000 });
    
    alertMock.mockRestore();
  });
});
