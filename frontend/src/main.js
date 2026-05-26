import './style.css';
import { getTasks, createTask, updateTask, deleteTask } from './api.js';

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

function addNewTaskButtons(card, task) {
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'task-actions';
  
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Starta';
  startBtn.className = 'btn-start';
  startBtn.addEventListener('click', () => {
    openAssignModal(task);
  });
  
  buttonsDiv.appendChild(startBtn);
  card.appendChild(buttonsDiv);
}

function addDoingTaskButtons(card, task) {
  
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'task-actions';
  
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Ångra';
  backBtn.className = 'btn-back';
  backBtn.addEventListener('click', async () => {
    await updateTask(task.id, { status: 'new' });
    loadTasks();
  });
  
  const completeBtn = document.createElement('button');
  completeBtn.textContent = 'Slutför';
  completeBtn.className = 'btn-complete';
  completeBtn.addEventListener('click', async () => {
    await updateTask(task.id, { status: 'done' });
    loadTasks();
  });
  
  buttonsDiv.appendChild(backBtn);
  buttonsDiv.appendChild(completeBtn);
  card.appendChild(buttonsDiv);
}

function addDoneTaskButtons(card, task) {
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'task-actions';
  
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Ångra';
  backBtn.className = 'btn-back';
  backBtn.addEventListener('click', async () => {
    await updateTask(task.id, { status: 'doing' });
    loadTasks();
  });
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Radera';
  deleteBtn.className = 'btn-delete';
  deleteBtn.addEventListener('click', () => {
    openDeleteModal(task);
  });
  
  buttonsDiv.appendChild(backBtn);
  buttonsDiv.appendChild(deleteBtn);
  card.appendChild(buttonsDiv);
}

function setupModal() {
  const modal = document.getElementById('task-modal');
  const openBtn = document.getElementById('open-modal-btn');
  const closeBtn = document.querySelector('.close-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const overlay = document.querySelector('.modal-overlay');
  const form = document.getElementById('task-form');

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    form.reset();
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const category = document.getElementById('task-category').value;

    try {
      await createTask({ title, description, category });
      closeModal();
      loadTasks();
    } catch (error) {
      console.error('Fel vid skapande av task:', error);
      alert('Kunde inte skapa task. Försök igen.');
    }
  });
}

function openAssignModal(task) {
  const modal = document.getElementById('assign-modal');
  const modalContent = modal.querySelector('.modal-content');
  
  // Rensa hela modal-innehållet och bygg om
  modalContent.innerHTML = `
    <h3>Vem ska göra denna uppgift?</h3>
    <input type="text" id="assign-person-input" placeholder="Ange namn..." />
    <div class="modal-buttons">
      <button id="assign-ok-btn" class="btn-primary">OK</button>
      <button id="assign-cancel-btn" class="btn-cancel">Avbryt</button>
    </div>
  `;
  
  modal.classList.remove('hidden');
  
  const input = document.getElementById('assign-person-input');
  const okBtn = document.getElementById('assign-ok-btn');
  const cancelBtn = document.getElementById('assign-cancel-btn');
  const overlay = modal.querySelector('.modal-overlay');
  
  input.focus();
  
  const closeModal = () => {
    modal.classList.add('hidden');
  };
  
  const handleOk = async () => {
    const assignedTo = input.value.trim();
    
    if (!assignedTo) {
      alert('Du måste ange ett namn!');
      return;
    }
    
    await updateTask(task.id, { 
      status: 'doing', 
      assignedTo: assignedTo 
    });
    closeModal();
    loadTasks();
  };
  
  okBtn.addEventListener('click', handleOk);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleOk();
    }
  });
}

function openDeleteModal(task) {
  const modal = document.getElementById('delete-modal');
  const confirmBtn = document.getElementById('delete-confirm-btn');
  const cancelBtn = document.getElementById('delete-cancel-btn');
  const overlay = modal.querySelector('.modal-overlay');
  
  modal.classList.remove('hidden');
  
  const closeModal = () => {
    modal.classList.add('hidden');
  };
  
  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      closeModal();
      loadTasks();
    } catch (error) {
      console.error('Fel vid radering:', error);
      alert('Kunde inte radera task. Försök igen.');
    }
  };
  
  // Ta bort gamla listeners
  confirmBtn.replaceWith(confirmBtn.cloneNode(true));
  cancelBtn.replaceWith(cancelBtn.cloneNode(true));
  overlay.replaceWith(overlay.cloneNode(true));
  
  // Hämta nya referenser
  const newConfirmBtn = document.getElementById('delete-confirm-btn');
  const newCancelBtn = document.getElementById('delete-cancel-btn');
  const newOverlay = modal.querySelector('.modal-overlay');
  
  newConfirmBtn.addEventListener('click', handleDelete);
  newCancelBtn.addEventListener('click', closeModal);
  newOverlay.addEventListener('click', closeModal);
}