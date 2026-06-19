import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Checkbox, 
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import { DeleteOutlined as DeleteOutlineIcon, AddTask as AddTaskIcon } from '@mui/icons-material';
import { apiFetch } from '../api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await apiFetch('/tasks/');
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    try {
      const addedTask = await apiFetch('/tasks/', {
        method: 'POST',
        body: JSON.stringify({ title: newTask })
      });
      setTasks([addedTask, ...tasks]);
      setNewTask('');
    } catch (error) {
      alert("Не вдалося додати завдання");
    }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      const updatedTask = await apiFetch(`/tasks/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_completed: !currentStatus })
      });
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      alert("Не вдалося оновити статус");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await apiFetch(`/tasks/${id}/`, { method: 'DELETE' });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      alert("Не вдалося видалити завдання");
    }
  };

  const completedCount = tasks.filter(t => t.is_completed).length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Мої завдання
        </Typography>
        <Chip 
          label={`${completedCount} / ${tasks.length} виконано`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '16px' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Що потрібно зробити?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              sx={{ bgcolor: 'rgba(15, 23, 42, 0.4)', borderRadius: 1 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              sx={{ minWidth: 120 }}
              startIcon={<AddTaskIcon />}
              disabled={!newTask.trim()}
            >
              Додати
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <List sx={{ p: 0 }}>
          {tasks.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">У вас немає завдань. Додайте нове завдання вище!</Typography>
            </Box>
          ) : (
            tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: index < tasks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.02)'
                    }
                  }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)} sx={{ color: 'error.main' }}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={task.is_completed}
                      onChange={() => handleToggleTask(task.id, task.is_completed)}
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    primaryTypographyProps={{
                      sx: { 
                        textDecoration: task.is_completed ? 'line-through' : 'none',
                        color: task.is_completed ? 'text.secondary' : 'text.primary',
                        fontWeight: task.is_completed ? 'normal' : '500',
                        fontSize: '1.1rem'
                      }
                    }}
                  />
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Card>
    </Box>
  );
}

export default Dashboard;
