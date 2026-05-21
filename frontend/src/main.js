import './style.css';
import { getTasks } from './api.js';

async function loadTasks() {
  try {
    const tasks = await getTasks();
    console.log('Tasks från API:', tasks);
  } catch (error) {
    console.error('Fel vid hämtning:', error);
  }
}

loadTasks();