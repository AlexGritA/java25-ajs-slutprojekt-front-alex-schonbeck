import './style.css';
import { getTasks, createTask } from './api.js';

// Ladda tasks när sidan laddas
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  setupModal();
});

async function loadTasks() {
  try {
    const tasks = await getTasks();
    renderTasks(tasks);
  } catch (error) {
    console.error('Fel vid hämtning:', error);
  }
}

function renderTasks(tasks) {
  // Rensa kolumnerna först
  document.getElementById('new-tasks').innerHTML = '';
  document.getElementById('doing-tasks').innerHTML = '';
  document.getElementById('done-tasks').innerHTML = '';

  // Sortera tasks i rätt kolumn
  tasks.forEach(task => {
    const taskCard = createTaskCard(task);
    
    if (task.status === 'new') {
      document.getElementById('new-tasks').appendChild(taskCard);
    } else if (task.status === 'doing') {
      document.getElementById('doing-tasks').appendChild(taskCard);
    } else if (task.status === 'done') {
      document.getElementById('done-tasks').appendChild(taskCard);
    }
  });
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <small>Category: ${task.category}</small>
    ${task.assignedTo ? `<p><strong>Assigned to:</strong> ${task.assignedTo}</p>` : ''}
  `;
  return card;
}

// Modal-funktionalitet
function setupModal() {
  const modal = document.getElementById('task-modal');
  const openBtn = document.getElementById('open-modal-btn');
  const closeBtn = document.querySelector('.close-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const overlay = document.querySelector('.modal-overlay');
  const form = document.getElementById('task-form');

  // Öppna modal
  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // Stäng modal
  const closeModal = () => {
    modal.classList.add('hidden');
    form.reset();
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Skicka formulär
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const category = document.getElementById('task-category').value;

    try {
      await createTask({ title, description, category });
      closeModal();
      loadTasks(); // Ladda om tasks för att visa den nya
    } catch (error) {
      console.error('Fel vid skapande av task:', error);
      alert('Kunde inte skapa task. Försök igen.');
    }
  });
}