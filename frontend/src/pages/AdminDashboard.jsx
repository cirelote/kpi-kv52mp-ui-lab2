import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Chip } from '@mui/material';
import { useWebSocket } from '../hooks/useWebSocket';

function AdminDashboard() {
    const [onlineUsers, setOnlineUsers] = useState([]);

    const wsUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL.replace('http', 'ws')}/ws/presence/`
        : 'ws://localhost:8000/ws/presence/';

    const { isConnected } = useWebSocket(wsUrl, (data) => {
        if (data.type === 'presence_update') {
            setOnlineUsers(data.users);
        }
    });

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            
            <Paper elevation={3} sx={{ p: 3, mt: 3, backgroundColor: 'background.paper' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h6">Online Users</Typography>
                    <Chip 
                        label={isConnected ? "Live" : "Connecting..."} 
                        color={isConnected ? "success" : "warning"} 
                        size="small" 
                    />
                </Box>
                
                <List>
                    {onlineUsers.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No other users online right now." />
                        </ListItem>
                    ) : (
                        onlineUsers.map((user, idx) => (
                            <ListItem key={idx} divider={idx < onlineUsers.length - 1}>
                                <ListItemText 
                                    primary={user.email} 
                                    secondary={`User ID: ${user.id}`} 
                                />
                                <Chip label="Online" color="success" size="small" variant="outlined" />
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>
        </Box>
    );
}

export default AdminDashboard;
