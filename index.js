import express from 'express';
import { getTasks, createTask, toggleTask, deleteTask } from './src/tasks.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    app: "NEXO API",
    status: "Activo",
    version: "1.0.0",
    message: "Bienvenido a tu asistente personal NEXO"
  });
});

// Rutas de Tareas
app.get('/api/tasks', getTasks);
app.post('/api/tasks', createTask);
app.patch('/api/tasks/:id', toggleTask);
app.delete('/api/tasks/:id', deleteTask);

app.listen(PORT, () => {
  console.log(`====================================`);
  console.log(`🚀 Servidor NEXO ejecutándose en: http://localhost:${PORT}`);
  console.log(`====================================`);
});