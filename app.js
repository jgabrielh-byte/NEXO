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
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleInput.value })
    });
    titleInput.value = '';
    loadTasks();
  });

  // Crear Nota
  document.getElementById('form-note').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('input-note-title');
    const contentInput = document.getElementById('input-note-content');
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleInput.value, content: contentInput.value })
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
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleInput.value, dateTime: dateInput.value })
    });
    titleInput.value = '';
    dateInput.value = '';
    loadReminders();
  });
}

// Cargar y mostrar Tareas
async function loadTasks() {
  try {
    const res = await fetch('/api/tasks');
    const { data } = await res.json();
    const container = document.getElementById('tasks-list');

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-slate-500 italic text-xs">Sin tareas pendientes.</p>';
      return;
    }

    container.innerHTML = data.map(task => `
      <div class="p-2 bg-slate-700/50 rounded flex justify-between items-center text-xs">
        <span class="${task.completed ? 'line-through text-slate-500' : ''}">${task.title}</span>
        <div class="space-x-1">
          <button onclick="toggleTask(${task.id})" class="px-1.5 py-0.5 rounded ${task.completed ? 'bg-slate-600 text-slate-400' : 'bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600/50'}">
            ${task.completed ? '✓' : '⌛'}
          </button>
          <button onclick="deleteTask(${task.id})" class="px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-400 hover:bg-rose-600/50">✕</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error cargando tareas:', err);
  }
}

// Cargar y mostrar Notas
async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    const { data } = await res.json();
    const container = document.getElementById('notes-list');

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-slate-500 italic text-xs">Sin notas creadas.</p>';
      return;
    }

    container.innerHTML = data.map(note => `
      <div class="p-2 bg-slate-700/50 rounded flex justify-between items-start text-xs">
        <div class="space-y-0.5">
          <h3 class="font-semibold text-slate-200">${note.title}</h3>
          <p class="text-[11px] text-slate-400">${note.content}</p>
        </div>
        <button onclick="deleteNote(${note.id})" class="px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-400 hover:bg-rose-600/50 ml-2">✕</button>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error cargando notas:', err);
  }
}

// Cargar y mostrar Recordatorios
async function loadReminders() {
  try {
    const res = await fetch('/api/reminders');
    const { data } = await res.json();
    const container = document.getElementById('reminders-list');

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-slate-500 italic text-xs">Sin recordatorios.</p>';
      return;
    }

    container.innerHTML = data.map(reminder => `
      <div class="p-2 bg-slate-700/50 rounded flex justify-between items-center text-xs">
        <div>
          <p class="${reminder.completed ? 'line-through text-slate-500' : ''}">${reminder.title}</p>
          <p class="text-[10px] text-slate-400">${new Date(reminder.dateTime).toLocaleString()}</p>
        </div>
        <div class="space-x-1">
          <button onclick="toggleReminder(${reminder.id})" class="px-1.5 py-0.5 rounded ${reminder.completed ? 'bg-slate-600 text-slate-400' : 'bg-sky-600/30 text-sky-400 hover:bg-sky-600/50'}">
            ${reminder.completed ? '✓' : '🔔'}
          </button>
          <button onclick="deleteReminder(${reminder.id})" class="px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-400 hover:bg-rose-600/50">✕</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error cargando recordatorios:', err);
  }
}

// Acciones Tareas
async function toggleTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'PATCH' });
  loadTasks();
}
async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

// Acciones Notas
async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  loadNotes();
}

// Acciones Recordatorios
async function toggleReminder(id) {
  await fetch(`/api/reminders/${id}`, { method: 'PATCH' });
  loadReminders();
}
async function deleteReminder(id) {
  await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
  loadReminders();
}