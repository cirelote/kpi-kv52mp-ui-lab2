import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  ThemeProvider, 
  CssBaseline,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

import theme from './theme';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import SharedTasks from './pages/SharedTasks';
import AdminDashboard from './pages/AdminDashboard';

import { useAuth } from './context/AuthContext';

function Navigation() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const desktopLinks = isAuthenticated ? (
    <>
      <Button component={Link} to="/" color={location.pathname === '/' ? 'primary' : 'inherit'}>Tasks</Button>
      <Button component={Link} to="/shared" color={location.pathname === '/shared' ? 'primary' : 'inherit'}>Shared Tasks</Button>
      <Button component={Link} to="/admin" color={location.pathname === '/admin' ? 'primary' : 'inherit'}>Admin</Button>
      <Button component={Link} to="/profile" color={location.pathname === '/profile' ? 'primary' : 'inherit'}>Profile</Button>
      <Button component={Link} to="/about" color={location.pathname === '/about' ? 'primary' : 'inherit'}>About</Button>
      <Button onClick={logout} variant="outlined" color="error" sx={{ ml: 2 }}>Logout</Button>
    </>
  ) : (
    <>
      <Button component={Link} to="/about" color={location.pathname === '/about' ? 'primary' : 'inherit'}>About</Button>
      <Button component={Link} to="/login" variant="outlined" sx={{ ml: 2 }}>Login</Button>
      <Button component={Link} to="/register" variant="contained" color="primary">Sign Up</Button>
    </>
  );

  const mobileLinks = isAuthenticated ? (
    <>
      <MenuItem component={Link} to="/" onClick={handleMenuClose}>Tasks</MenuItem>
      <MenuItem component={Link} to="/shared" onClick={handleMenuClose}>Shared Tasks</MenuItem>
      <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>Admin</MenuItem>
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem component={Link} to="/about" onClick={handleMenuClose}>About</MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); logout(); }} sx={{ color: 'error.main', fontWeight: 'bold' }}>Logout</MenuItem>
    </>
  ) : (
    <>
      <MenuItem component={Link} to="/about" onClick={handleMenuClose}>About</MenuItem>
      <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>
      <MenuItem component={Link} to="/register" onClick={handleMenuClose}>Sign Up</MenuItem>
    </>
  );

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Toolbar>
        <img src="/android-chrome-512x512.png" alt="To-Do Logo" style={{ width: 32, height: 32, marginRight: 8 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          To-Do
        </Typography>
        
        {/* Desktop View */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
          {desktopLinks}
        </Box>

        {/* Mobile View */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" edge="end" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {mobileLinks}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navigation />
        <Container component="main" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shared" element={<SharedTasks />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
