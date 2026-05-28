import './style.css';
import { loadTasks } from './board.js';
import { setupModal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  setupModal();
});