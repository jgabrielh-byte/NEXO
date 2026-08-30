// Base de datos temporal en memoria
let notes = [
  {
    id: 1,
    title: "Notas de la reunión",
    content: "Revisar arquitectura del sistema NEXO y coordinar módulos backend.",
    createdAt: new Date()
  }
];

// Obtener todas las notas
export const getNotes = (req, res) => {
  res.json({
    success: true,
    data: notes
  });
};

// Crear una nueva nota
export const createNote = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "El título y el contenido son obligatorios"
    });
  }

  const newNote = {
    id: notes.length + 1,
    title,
    content,
    createdAt: new Date()
  };

  notes.push(newNote);

  res.status(201).json({
    success: true,
    message: "Nota creada correctamente",
    data: newNote
  });
};

// Eliminar una nota
export const deleteNote = (req, res) => {
  const { id } = req.params;
  const initialLength = notes.length;
  notes = notes.filter((n) => n.id !== parseInt(id));

  if (notes.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: "Nota no encontrada"
    });
  }

  res.json({
    success: true,
    message: "Nota eliminada correctamente"
  });
};
