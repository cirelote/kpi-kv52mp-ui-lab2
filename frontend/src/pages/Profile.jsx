import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Paper,
  Avatar,
  CircularProgress
} from '@mui/material';
import { apiFetch } from '../api';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch('/users/profile/');
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography color="error">Помилка завантаження профілю: {error}</Typography>
      </Box>
    );
  }

  if (!userData) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Профіль користувача
      </Typography>
      
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              mb: 2, 
              bgcolor: 'primary.main',
              fontSize: '2.5rem'
            }}
          >
            {userData.name.charAt(0)}
          </Avatar>
          <Typography variant="h5" gutterBottom>
            {userData.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {userData.email}
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 4, bgcolor: 'background.default', borderRadius: 2 }}>
            <Table aria-label="profile table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'text.secondary', width: '40%' }}>
                    Повне ім'я
                  </TableCell>
                  <TableCell>{userData.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    Email адреса
                  </TableCell>
                  <TableCell>{userData.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    Стать
                  </TableCell>
                  <TableCell>{userData.gender === 'M' ? 'Чоловіча' : userData.gender === 'F' ? 'Жіноча' : 'Інша'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    Дата народження
                  </TableCell>
                  <TableCell>{userData.date_of_birth || 'Не вказано'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Profile;
