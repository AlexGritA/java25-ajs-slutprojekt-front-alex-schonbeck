import { updateTask } from './api.js';
import { loadTasks } from './board.js';
import { openAssignModal, openDeleteModal } from './modal.js'

export function addNewTaskButtons(card, task) {
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

export function addDoingTaskButtons(card, task) {
  
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

export function addDoneTaskButtons(card, task) {
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