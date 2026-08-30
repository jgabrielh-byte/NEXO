// Base de datos temporal en memoria
let reminders = [
  {
    id: 1,
    title: "Reunión de avance",
    dateTime: "2026-08-30T10:00:00",
    completed: false
  }
];

// Obtener todos los recordatorios
export const getReminders = (req, res) => {
  res.json({
    success: true,
    data: reminders
  });
};

// Crear un nuevo recordatorio
export const createReminder = (req, res) => {
  const { title, dateTime } = req.body;

  if (!title || !dateTime) {
    return res.status(400).json({
      success: false,
      message: "El título y la fecha/hora son obligatorios"
    });
  }

  const newReminder = {
    id: reminders.length + 1,
    title,
    dateTime,
    completed: false
  };

  reminders.push(newReminder);

  res.status(201).json({
    success: true,
    message: "Recordatorio creado correctamente",
    data: newReminder
  });
};

// Marcar como completado/pendiente
export const toggleReminder = (req, res) => {
  const { id } = req.params;
  const reminder = reminders.find((r) => r.id === parseInt(id));

  if (!reminder) {
    return res.status(404).json({
      success: false,
      message: "Recordatorio no encontrado"
    });
  }

  reminder.completed = !reminder.completed;

  res.json({
    success: true,
    message: "Estado del recordatorio actualizado",
    data: reminder
  });
};

// Eliminar un recordatorio
export const deleteReminder = (req, res) => {
  const { id } = req.params;
  const initialLength = reminders.length;
  reminders = reminders.filter((r) => r.id !== parseInt(id));

  if (reminders.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: "Recordatorio no encontrado"
    });
  }

  res.json({
    success: true,
    message: "Recordatorio eliminado correctamente"
  });
};