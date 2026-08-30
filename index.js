import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Task from './models/Task.js';
import Note from './models/Note.js';
import Reminder from './models/Reminder.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado con éxito a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- RUTAS TAREAS ---
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json({ data: tasks });
});

app.post('/api/tasks', async (req, res) => {
  const newTask = await Task.create(req.body);
  res.json({ data: newTask });
});

app.put('/api/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.id || req.params.id, req.body, { new: true });
  res.json({ data: updatedTask });
});

app.patch('/api/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json({ data: task });
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Tarea eliminada' });
});

// --- RUTAS NOTAS ---
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json({ data: notes });
});

app.post('/api/notes', async (req, res) => {
  const newNote = await Note.create(req.body);
  res.json({ data: newNote });
});

app.put('/api/notes/:id', async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ data: updatedNote });
});

app.delete('/api/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Nota eliminada' });
});

// --- RUTAS RECORDATORIOS ---
app.get('/api/reminders', async (req, res) => {
  const reminders = await Reminder.find().sort({ createdAt: -1 });
  res.json({ data: reminders });
});

app.post('/api/reminders', async (req, res) => {
  const newReminder = await Reminder.create(req.body);
  res.json({ data: newReminder });
});

app.put('/api/reminders/:id', async (req, res) => {
  const updatedReminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ data: updatedReminder });
});

app.patch('/api/reminders/:id', async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);
  reminder.completed = !reminder.completed;
  await reminder.save();
  res.json({ data: reminder });
});

app.delete('/api/reminders/:id', async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ message: 'Recordatorio eliminado' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor NEXO en: http://localhost:${PORT}`);
});