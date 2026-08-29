// Base de datos temporal en memoria
let tasks = [
  {
    id: 1,
    title: "Configurar entorno de desarrollo",
    completed: true,
    createdAt: new Date()
  },
  {
    id: 2,
    title: "Crear el módulo de tareas en NEXO",
    completed: false,
    createdAt: new Date()
  }
];

// Obtener todas las tareas
export const getTasks = (req, res) => {
  res.json({
    success: true,
    data: tasks
  });
};

// Crear una nueva tarea
export const createTask = (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "El título de la tarea es obligatorio"
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Tarea creada correctamente",
    data: newTask
  });
};

// Cambiar estado de la tarea (completada / pendiente)
export const toggleTask = (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Tarea no encontrada"
    });
  }

  task.completed = !task.completed;

  res.json({
    success: true,
    message: "Estado de la tarea actualizado",
    data: task
  });
};

// Eliminar una tarea
export const deleteTask = (req, res) => {
  const { id } = req.params;
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== parseInt(id));

  if (tasks.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: "Tarea no encontrada"
    });
  }

  res.json({
    success: true,
    message: "Tarea eliminada correctamente"
  });
};