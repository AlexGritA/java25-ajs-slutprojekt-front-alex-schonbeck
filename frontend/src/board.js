import { getTasks } from './api.js';
import { addNewTaskButtons, addDoingTaskButtons, addDoneTaskButtons } from './buttons.js'

export async function loadTasks() {
  try {
    const tasks = await getTasks();
    renderTasks(tasks);
  } catch (error) {
    console.error('Fel vid hämtning:', error);
  }
}

function renderTasks(tasks) {
  document.getElementById('new-tasks').innerHTML = '';
  document.getElementById('doing-tasks').innerHTML = '';
  document.getElementById('done-tasks').innerHTML = '';

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

  const date = new Date(task.timestamp);
  const formattedDate = date.toLocaleDateString('sv-SE') + ' ' + date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

  card.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <small>Category: ${task.category}</small>
    <small class="timestamp">Created: ${formattedDate}</small>
    ${task.assignedTo ? `<p><strong>Assigned to:</strong> ${task.assignedTo}</p>` : ''}
  `;

  if (task.status === 'new') {
    addNewTaskButtons(card, task);
  } else if (task.status === 'doing') {
    addDoingTaskButtons(card, task);
  } else if (task.status === 'done') {
    addDoneTaskButtons(card, task);
  }

  return card;
}
