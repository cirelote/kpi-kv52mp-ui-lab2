import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, TextField, Button, Chip } from '@mui/material';
import { useWebSocket } from '../hooks/useWebSocket';

function SharedTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const wsUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL.replace('http', 'ws')}/ws/shared_tasks/`
        : 'ws://localhost:8000/ws/shared_tasks/';

    const { isConnected } = useWebSocket(wsUrl, (data) => {
        if (data.type === 'task_update') {
            if (data.action === 'create') {
                setTasks(prev => {
                    if (prev.some(t => t.id === data.task.id)) return prev;
                    return [data.task, ...prev];
                });
            } else if (data.action === 'update') {
                setTasks(prev => prev.map(t => t.id === data.task.id ? data.task : t));
            } else if (data.action === 'delete') {
                setTasks(prev => prev.filter(t => t.id !== data.task_id));
            }
        }
    });

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/tasks/shared/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
            setLoading(false);
        };
        fetchTasks();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/tasks/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTaskTitle, is_shared: true })
        });
        
        if (res.ok) {
            setNewTaskTitle('');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h4">Shared Tasks Board</Typography>
                <Chip 
                    label={isConnected ? "Live" : "Connecting..."} 
                    color={isConnected ? "success" : "warning"} 
                />
            </Box>

            <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField 
                    fullWidth 
                    label="New Shared Task" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Button type="submit" variant="contained">Add</Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tasks.map(task => (
                    <Card key={task.id} elevation={3}>
                        <CardContent>
                            <Typography variant="h6">{task.title}</Typography>
                            <Typography color="text.secondary">Created: {new Date(task.created_at).toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                ))}
                {tasks.length === 0 && (
                    <Typography color="text.secondary">No shared tasks yet.</Typography>
                )}
            </Box>
        </Box>
    );
}

export default SharedTasks;
