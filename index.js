import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { getTasks, createTask, toggleTask, deleteTask } from './src/tasks.js';
import { getNotes, createNote, deleteNote } from './src/notes.js';
import { getReminders, createReminder, toggleReminder, deleteReminder } from './src/reminders.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para servir archivos estáticos (HTML/JS/CSS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

// Ruta principal: sirve la interfaz visual
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas de Tareas
app.get('/api/tasks', getTasks);
app.post('/api/tasks', createTask);
app.patch('/api/tasks/:id', toggleTask);
app.delete('/api/tasks/:id', deleteTask);

// Rutas de Notas
app.get('/api/notes', getNotes);
app.post('/api/notes', createNote);
app.delete('/api/notes/:id', deleteNote);

// Rutas de Recordatorios
app.get('/api/reminders', getReminders);
app.post('/api/reminders', createReminder);
app.patch('/api/reminders/:id', toggleReminder);
app.delete('/api/reminders/:id', deleteReminder);

app.listen(PORT, () => {
  console.log(`====================================`);
  console.log(`🚀 Servidor NEXO ejecutándose en: http://localhost:${PORT}`);
  console.log(`====================================`);
});