import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  MenuItem,
  Avatar
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

// Validation schema
const schema = yup.object({
  name: yup.string().required("Ім'я є обов'язковим").min(2, "Ім'я занадто коротке"),
  email: yup.string().required("Email є обов'язковим").email('Некоректний формат Email'),
  gender: yup.string().required("Оберіть стать"),
  birthDate: yup.string().required("Оберіть дату народження"),
  password: yup.string().required("Пароль є обов'язковим").min(6, 'Мінімум 6 символів'),
}).required();

function Register() {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const genderMap = { male: 'M', female: 'F', other: 'O' };
    try {
      await apiFetch('/users/register/', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          gender: genderMap[data.gender] || 'O',
          date_of_birth: data.birthDate,
        }),
      });
      alert('Реєстрація успішна! Тепер ви можете увійти.');
      navigate('/login');
    } catch (error) {
      alert('Помилка реєстрації: ' + error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
      <Card sx={{ maxWidth: 500, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'transparent', width: 56, height: 56 }}>
              <img src="/android-chrome-512x512.png" alt="Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom>
              Створити акаунт
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Приєднуйтесь до To-Do для керування вашими завданнями.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ім'я"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue="male"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Стать"
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                    >
                      <MenuItem value="male">Чоловіча</MenuItem>
                      <MenuItem value="female">Жіноча</MenuItem>
                      <MenuItem value="other">Інша</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name="birthDate"
                  control={control}
                  defaultValue="2000-01-01"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Дата народження"
                      type="date"
                      variant="outlined"
                      error={!!errors.birthDate}
                      helperText={errors.birthDate?.message}
                    />
                  )}
                />
              </Box>

              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Пароль"
                    type="password"
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />

              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary"
                size="large"
                sx={{ mt: 1 }}
              >
                Зареєструватися
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
