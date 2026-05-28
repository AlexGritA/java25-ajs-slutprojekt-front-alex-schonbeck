import { createTask, updateTask, deleteTask } from './api.js';
import { loadTasks } from './board.js';

export function openAssignModal(task) {
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

export function openDeleteModal(task) {
  const modal = document.getElementById('delete-modal');
  const modalContent = modal.querySelector('.modal-content');
  
  modalContent.innerHTML = `
    <h3>Är du säker på att du vill radera denna uppgift?</h3>
    <div class="modal-buttons">
      <button id="delete-confirm-btn" class="btn-delete">Radera</button>
      <button id="delete-cancel-btn" class="btn-cancel">Avbryt</button>
    </div>
  `;
  
  modal.classList.remove('hidden');
  
  const confirmBtn = document.getElementById('delete-confirm-btn');
  const cancelBtn = document.getElementById('delete-cancel-btn');
  const overlay = modal.querySelector('.modal-overlay');
  
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
  
  confirmBtn.addEventListener('click', handleDelete);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

export function setupModal() {
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

