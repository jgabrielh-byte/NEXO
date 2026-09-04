document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadTasks();
  loadNotes();
  loadReminders();
  setupEventListeners();
});

// --- TEMA CLARO / OSCURO ---
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

// --- ESCUCHADORES DE EVENTOS ---
function setupEventListeners() {
  // Buscador global
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterAllContent(query);
    });
  }

  // Alternar tema
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Formulario Tareas
  const formTask = document.getElementById('form-task');
  if (formTask) {
    formTask.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('input-task-title');
      const title = input.value.trim();
      if (!title) return;

      const tasks = JSON.parse(localStorage.getItem('nexo_tasks') || '[]');
      tasks.push({ id: Date.now().toString(), title, completed: false });
      localStorage.setItem('nexo_tasks', JSON.stringify(tasks));

      input.value = '';
      loadTasks();
    });
  }

  // Formulario Notas
  const formNote = document.getElementById('form-note');
  if (formNote) {
    formNote.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('input-note-title');
      const contentInput = document.getElementById('input-note-content');
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      if (!title || !content) return;

      const notes = JSON.parse(localStorage.getItem('nexo_notes') || '[]');
      notes.push({ id: Date.now().toString(), title, content });
      localStorage.setItem('nexo_notes', JSON.stringify(notes));

      titleInput.value = '';
      contentInput.value = '';
      loadNotes();
    });
  }

  // Formulario Recordatorios
  const formReminder = document.getElementById('form-reminder');
  if (formReminder) {
    formReminder.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('input-reminder-title');
      const dateInput = document.getElementById('input-reminder-date');
      const title = titleInput.value.trim();
      const date = dateInput.value;
      if (!title || !date) return;

      const reminders = JSON.parse(localStorage.getItem('nexo_reminders') || '[]');
      reminders.push({ id: Date.now().toString(), title, date });
      localStorage.setItem('nexo_reminders', JSON.stringify(reminders));

      titleInput.value = '';
      dateInput.value = '';
      loadReminders();
    });
  }
}

// --- BUSCADOR ---
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

// --- CARGAR Y RENDERIZAR DATOS DESDE LOCALSTORAGE ---
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('nexo_tasks') || '[]');
  const tasksList = document.getElementById('tasks-list');
  if (!tasksList) return;

  tasksList.innerHTML = tasks.map(task => `
    <div class="p-2 bg-slate-900/60 rounded border border-slate-700/60 flex justify-between items-center text-xs">
      <span class="${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}">${task.title}</span>
      <button onclick="deleteTask('${task.id}')" class="text-rose-400 hover:text-rose-300 ml-2">✕</button>
    </div>
  `).join('');
  
  const counter = document.getElementById('task-counter');
  if (counter) {
    const pending = tasks.filter(t => !t.completed).length;
    counter.textContent = `${pending} pendiente${pending !== 1 ? 's' : ''}`;
  }
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('nexo_notes') || '[]');
  const notesList = document.getElementById('notes-list');
  if (!notesList) return;

  notesList.innerHTML = notes.map(note => `
    <div class="p-2 bg-slate-900/60 rounded border border-slate-700/60 text-xs space-y-1">
      <div class="flex justify-between items-center">
        <h4 class="font-bold text-amber-400">${note.title}</h4>
        <button onclick="deleteNote('${note.id}')" class="text-rose-400 hover:text-rose-300">✕</button>
      </div>
      <p class="text-slate-300">${note.content}</p>
    </div>
  `).join('');
}

function loadReminders() {
  const reminders = JSON.parse(localStorage.getItem('nexo_reminders') || '[]');
  const remindersList = document.getElementById('reminders-list');
  if (!remindersList) return;

  remindersList.innerHTML = reminders.map(r => `
    <div class="p-2 bg-slate-900/60 rounded border border-slate-700/60 text-xs space-y-1">
      <div class="flex justify-between items-center">
        <p class="text-sky-300 font-medium">${r.title}</p>
        <button onclick="deleteReminder('${r.id}')" class="text-rose-400 hover:text-rose-300">✕</button>
      </div>
      <span class="text-slate-400 text-[10px]">${new Date(r.date).toLocaleString()}</span>
    </div>
  `).join('');
}

// --- ELIMINAR DATOS ---
function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem('nexo_tasks') || '[]');
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('nexo_tasks', JSON.stringify(tasks));
  loadTasks();
}

function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem('nexo_notes') || '[]');
  notes = notes.filter(n => n.id !== id);
  localStorage.setItem('nexo_notes', JSON.stringify(notes));
  loadNotes();
}

function deleteReminder(id) {
  let reminders = JSON.parse(localStorage.getItem('nexo_reminders') || '[]');
  reminders = reminders.filter(r => r.id !== id);
  localStorage.setItem('nexo_reminders', JSON.stringify(reminders));
  loadReminders();
}