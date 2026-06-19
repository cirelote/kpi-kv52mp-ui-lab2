import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider, CircularProgress } from '@mui/material';
import { CheckCircleOutlined as CheckCircleOutlineIcon } from '@mui/icons-material';
import { apiFetch } from '../api';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await apiFetch('/about/');
        setAboutData(data);
      } catch (error) {
        console.error("Failed to fetch about info", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const appName = aboutData?.app_name || "To-Do";
  const description = aboutData?.description || "Ваш персональний менеджер завдань.";

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" align="center" sx={{ mb: 4 }}>
        Про додаток
      </Typography>
      
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 33%' }, display: 'flex', justifyContent: 'center' }}>
              <Box 
                sx={{ 
                  bgcolor: aboutData?.logo_url ? 'transparent' : 'primary.main', 
                  width: 150, 
                  height: 150, 
                  borderRadius: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: aboutData?.logo_url ? 'none' : '0 10px 25px -5px rgba(124, 58, 237, 0.5)',
                  transform: 'rotate(-5deg)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'rotate(0deg) scale(1.05)',
                  }
                }}
              >
                {aboutData?.logo_url ? (
                  <img 
                    src={aboutData.logo_url} 
                    alt="App Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <CheckCircleOutlineIcon sx={{ color: 'white', fontSize: 80 }} />
                )}
              </Box>
            </Box>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
                {appName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Персональний менеджер завдань
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                {description}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                Додаток розроблено з використанням найсучасніших технологій: <strong>ReactJS</strong> для швидкого та реактивного інтерфейсу, та <strong>Material UI</strong> для забезпечення преміального дизайну та зручності користування на будь-яких пристроях.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default About;
