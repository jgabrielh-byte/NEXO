let currentTaskFilter = 'all'; // 'all', 'pending', 'completed'

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadNotes();
  loadReminders();
  setupEventListeners();
});

function setupEventListeners() {
  // Crear Tarea
  document.getElementById('form-task').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('input-task-title');
    const title = titleInput.value.trim();

    if (!title) {
      alert('Por favor, escribe un título para la tarea.');
      return;
    }

    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    titleInput.value = '';
    loadTasks();
  });

  // Filtros de Tareas
  document.getElementById('filter-all').addEventListener('click', () => setTaskFilter('all'));
  document.getElementById('filter-pending').addEventListener('click', () => setTaskFilter('pending'));
  document.getElementById('filter-completed').addEventListener('click', () => setTaskFilter('completed'));

  // Crear Nota
  document.getElementById('form-note').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('input-note-title');
    const contentInput = document.getElementById('input-note-content');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      alert('Por favor, completa tanto el título como el contenido de la nota.');
      return;
    }

    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    titleInput.value = '';
    contentInput.value = '';
    loadNotes();
  });

  // Crear Recordatorio
  document.getElementById('form-reminder').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('input-reminder-title');
    const dateInput = document.getElementById('input-reminder-date');
    const title = titleInput.value.trim();
    const dateTime = dateInput.value;

    if (!title || !dateTime) {
      alert('Por favor, ingresa un título y selecciona una fecha y hora válidas.');
      return;
    }

    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dateTime })
    });
    titleInput.value = '';
    dateInput.value = '';
    loadReminders();
  });
}

function setTaskFilter(filter) {
  currentTaskFilter = filter;
  
  // Actualizar estilos de los botones
  const buttons = {
    all: document.getElementById('filter-all'),
    pending: document.getElementById('filter-pending'),
    completed: document.getElementById('filter-completed')
  };

  Object.keys(buttons).forEach(key => {
    if (key === filter) {
      buttons[key].className = 'task-filter-btn px-2.5 py-1 rounded font-medium bg-slate-700 text-slate-200';
    } else {
      buttons[key].className = 'task-filter-btn px-2.5 py-1 rounded font-medium text-slate-400 hover:text-slate-200';
    }
  });

  loadTasks();
}

// Cargar Tareas
async function loadTasks() {
  try {
    const res = await fetch('/api/tasks');
    const { data } = await res.json();
    const container = document.getElementById('tasks-list');
    const counterElement = document.getElementById('task-counter');

    if (!data) return;

    // Actualizar contador de pendientes
    const pendingCount = data.filter(t => !t.completed).length;
    counterElement.textContent = `${pendingCount} pendiente${pendingCount === 1 ? '' : 's'}`;

    // Filtrar tareas según la pestaña seleccionada
    let filteredTasks = data;
    if (currentTaskFilter === 'pending') {
      filteredTasks = data.filter(t => !t.completed);
    } else if (currentTaskFilter === 'completed') {
      filteredTasks = data.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
      container.innerHTML = `<p class="text-slate-500 italic text-xs py-2">No hay tareas ${currentTaskFilter === 'completed' ? 'completadas' : 'en esta vista'}.</p>`;
      return;
    }

    container.innerHTML = '';
    filteredTasks.forEach(task => {
      const div = document.createElement('div');
      div.className = 'p-2 bg-slate-700/50 rounded flex justify-between items-center text-xs';
      div.innerHTML = `
        <span class="${task.completed ? 'line-through text-slate-500' : ''}">${task.title}</span>
        <div class="space-x-1 flex items-center">
          <button class="btn-edit px-1.5 py-0.5 rounded bg-amber-600/30 text-amber-400 hover:bg-amber-600/50">✏️</button>
          <button class="btn-toggle px-1.5 py-0.5 rounded ${task.completed ? 'bg-slate-600 text-slate-400' : 'bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600/50'}">
            ${task.completed ? '✓' : '⌛'}
          </button>
          <button class="btn-delete px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-400 hover:bg-rose-600/50">✕</button>
        </div>
      `;

      div.querySelector('.btn-edit').addEventListener('click', () => editTask(task._id, task.title));
      div.querySelector('.btn-toggle').addEventListener('click', () => toggleTask(task._id));
      div.querySelector('.btn-delete').addEventListener('click', () => deleteTask(task._id));

      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error cargando tareas:', err);
  }
}

// Cargar Notas
async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    const { data } = await res.json();
    const container = document.getElementById('notes-list');

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-slate-500 italic text-xs">Sin notas creadas.</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach(note => {
      const createdDate = note.createdAt 
        ? new Date(note.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
        : 'Hoy';

      const div = document.createElement('div');
      div.className = 'p-2 bg-slate-700/50 rounded flex justify-between items-start text-xs';
      div.innerHTML = `
        <div class="space-y-0.5 pr-2">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-slate-200">${note.title}</h3>
            <span class="text-[9px] bg-slate-600/50 text-slate-400 px-1.5 py-0.2 rounded">${createdDate}</span>
          </div>
          <p class="text-[11px] text-slate-400">${note.content}</p>
        </div>
        <div class="space-x-1 flex items-center shrink-0">
          <button class="btn-edit px-1.5 py-0.5 rounded bg-amber-600/30 text-amber-400 hover:bg-amber-600/50">✏️</button>
          <button class="btn-delete px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-400 hover:bg-rose-600/50">✕</button>
        </div>
      `;

      div.querySelector('.btn-edit').addEventListener('click', () => editNote(note._id, note.title, note.content));
      div.querySelector('.btn-delete').addEventListener('click', () => deleteNote(note._id));

      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error cargando notas:', err);
  }
}

// Cargar Recordatorios
async function loadReminders() {
  try {
    const res = await fetch('/api/reminders');
    const result = await res.json();
    const data = result.data || result;
    const container = document.getElementById('reminders-list');

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p class="text-slate-500 italic text-xs">Sin recordatorios.</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach(reminder => {
      const isExpired = new Date(reminder.dateTime) < new Date() && !reminder.completed;
      const formattedDate = new Date(reminder.dateTime).toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });

      const div = document.createElement('div');
      div.className = `p-2 ${isExpired ? 'bg-rose-950/40 border border-rose-500/30' : 'bg-slate-700/50'} rounded flex justify-between items-center text-xs`;
      div.innerHTML = `
        <div>
          <p class="${reminder.completed ? 'line-through text-slate-500' : isExpired ? 'text-rose-300 font-medium' : ''}">${reminder.title}</p>
          <p class="text-[10px] ${isExpired ? 'text-rose-400 font-semibold' : 'text-slate-400'}">
            ${formattedDate} ${isExpired ? '• ⚠️ Vencido' : ''}
          </p>
        </div>
        <div class="space-x-1 flex items-center">
          <button class="btn-edit px-1.5 py-0.5 rounded bg-amber-600/30 text-amber-400 hover:bg-amber-600/50">✏️</button>
          <button class="btn-toggle px-1.5 py-0.5 rounded ${reminder.completed ? 'bg-slate-600 text-slate-400' : 'bg-sky-600/30 text-sky-400 hover:bg-sky-600/50'}">
            ${reminder.completed ? '✓' : '🔔'}
          </button>
          <button class="btn-delete px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-400 hover:bg-rose-600/50">✕</button>
        </div>
      `;

      div.querySelector('.btn-edit').addEventListener('click', () => editReminder(reminder._id, reminder.title));
      div.querySelector('.btn-toggle').addEventListener('click', () => toggleReminder(reminder._id));
      div.querySelector('.btn-delete').addEventListener('click', () => deleteReminder(reminder._id));

      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error cargando recordatorios:', err);
  }
}

// --- ACCIONES TAREAS ---
async function editTask(id, currentTitle) {
  const newTitle = prompt('Editar título de la tarea:', currentTitle);
  if (newTitle !== null && newTitle.trim() !== '') {
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() })
    });
    loadTasks();
  }
}

async function toggleTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'PATCH' });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

// --- ACCIONES NOTAS ---
async function editNote(id, currentTitle, currentContent) {
  const newTitle = prompt('Editar título de la nota:', currentTitle);
  if (newTitle === null) return;
  const newContent = prompt('Editar contenido de la nota:', currentContent);
  if (newContent === null) return;

  await fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle.trim(), content: newContent.trim() })
  });
  loadNotes();
}

async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  loadNotes();
}

// --- ACCIONES RECORDATORIOS ---
async function editReminder(id, currentTitle) {
  const newTitle = prompt('Editar título del recordatorio:', currentTitle);
  if (newTitle !== null && newTitle.trim() !== '') {
    await fetch(`/api/reminders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() })
    });
    loadReminders();
  }
}

async function toggleReminder(id) {
  await fetch(`/api/reminders/${id}`, { method: 'PATCH' });
  loadReminders();
}

async function deleteReminder(id) {
  await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
  loadReminders();
}