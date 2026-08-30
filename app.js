document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadNotes();
  loadReminders();
});

// Cargar y mostrar Tareas
async function loadTasks() {
  try {
    const res = await fetch('/api/tasks');
    const { data } = await res.json();
    const container = document.getElementById('tasks-list');

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-slate-500 italic">No hay tareas registrados.</p>';
      return;
    }

    container.innerHTML = data.map(task => `
      <div class="p-2 bg-slate-700/50 rounded flex justify-between items-center">
        <span class="${task.completed ? 'line-through text-slate-500' : ''}">${task.title}</span>
        <span class="text-xs ${task.completed ? 'text-emerald-400' : 'text-amber-400'}">
          ${task.completed ? '✓' : '⌛'}
        </span>
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
      container.innerHTML = '<p class="text-slate-500 italic">No hay notas registradas.</p>';
      return;
    }

    container.innerHTML = data.map(note => `
      <div class="p-2 bg-slate-700/50 rounded space-y-1">
        <h3 class="font-semibold text-slate-200">${note.title}</h3>
        <p class="text-xs text-slate-400">${note.content}</p>
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
      container.innerHTML = '<p class="text-slate-500 italic">No hay recordatorios.</p>';
      return;
    }

    container.innerHTML = data.map(reminder => `
      <div class="p-2 bg-slate-700/50 rounded flex justify-between items-center">
        <div>
          <p class="${reminder.completed ? 'line-through text-slate-500' : ''}">${reminder.title}</p>
          <p class="text-[10px] text-slate-400">${new Date(reminder.dateTime).toLocaleString()}</p>
        </div>
        <span class="text-xs ${reminder.completed ? 'text-emerald-400' : 'text-sky-400'}">
          ${reminder.completed ? '✓' : '🔔'}
        </span>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error cargando recordatorios:', err);
  }
}