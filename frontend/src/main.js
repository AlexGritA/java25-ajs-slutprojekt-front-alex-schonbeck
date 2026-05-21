import './style.css';
import { getTasks } from './api.js';

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

// Vänta på att HTML laddas
document.addEventListener('DOMContentLoaded', loadTasks);