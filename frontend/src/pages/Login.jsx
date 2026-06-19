import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Link as MuiLink,
  Avatar
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { apiFetch, setTokens } from '../api';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({
  email: yup.string().required("Email є обов'язковим").email('Некоректний формат Email'),
  password: yup.string().required("Пароль є обов'язковим"),
}).required();

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiFetch('/users/login/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setTokens(response.access, response.refresh);
      login();
      navigate('/');
    } catch (error) {
      alert('Помилка входу: ' + error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'transparent', width: 56, height: 56 }}>
              <img src="/android-chrome-512x512.png" alt="Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom>
              З поверненням
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Увійдіть до свого акаунту To-Do
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Увійти
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Немає акаунту?{' '}
                <MuiLink component={Link} to="/register" color="primary">
                  Зареєструватися
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
