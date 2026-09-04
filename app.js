document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadTasks();
  loadNotes();
  loadReminders();
  setupEventListeners();
});

// Cargar y aplicar el tema guardado
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const btn = document.getElementById('theme-toggle');
  
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    if (btn) btn.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('light-mode');
    if (btn) btn.textContent = '🌙';
  }
}

// Alternar entre modo oscuro y claro
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-mode');
  const btn = document.getElementById('theme-toggle');
  
  if (isLight) {
    if (btn) btn.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  } else {
    if (btn) btn.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
}

// Escuchadores de eventos
function setupEventListeners() {
  // Buscador global en tiempo real
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterAllContent(query);
    });
  }

  // Alternar tema Claro / Oscuro
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Formularios
  const formTask = document.getElementById('form-task');
  if (formTask) {
    formTask.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('input-task-title');
      const title = input.value.trim();
      if (!title) return;

      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      input.value = '';
      loadTasks();
    });
  }
}

// Filtrar todo el contenido visualmente
function filterAllContent(query) {
  const items = document.querySelectorAll('#tasks-list > div, #notes-list > div, #reminders-list > div');

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(query)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

// Cargar Tareas desde la API
async function loadTasks() {
  try {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;

    tasksList.innerHTML = tasks.map(task => `
      <div class="p-2 bg-slate-900/60 rounded border border-slate-700/60 flex justify-between items-center text-xs">
        <span class="${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}">${task.title}</span>
      </div>
    `).join('');
    
    const counter = document.getElementById('task-counter');
    if (counter) {
      const pending = tasks.filter(t => !t.completed).length;
      counter.textContent = `${pending} pendiente${pending !== 1 ? 's' : ''}`;
    }
  } catch (err) {
    console.error('Error al cargar tareas:', err);
  }
}

// Cargar Notas desde la API
async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    const notes = await res.json();
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;

    notesList.innerHTML = notes.map(note => `
      <div class="p-2 bg-slate-900/60 rounded border border-slate-700/60 text-xs space-y-1">
        <h4 class="font-bold text-amber-400">${note.title}</h4>
        <p class="text-slate-300">${note.content}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error al cargar notas:', err);
  }
}

// Cargar Recordatorios desde la API
async function loadReminders() {
  try {
    const res = await fetch('/api/reminders');
    const reminders = await res.json();
    const remindersList = document.getElementById('reminders-list');
    if (!remindersList) return;

    remindersList.innerHTML = reminders.map(r => `
      <div class="p-2 bg-slate-900/60 rounded border border-slate-700/60 text-xs space-y-1">
        <p class="text-sky-300 font-medium">${r.title}</p>
        <span class="text-slate-400 text-[10px]">${new Date(r.date).toLocaleString()}</span>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error al cargar recordatorios:', err);
  }
}