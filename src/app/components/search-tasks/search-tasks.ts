// search-tasks.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoListComponent } from '../../components/todo-list-reusable/todo-list-reusable';

// Interfaces para las estructuras de datos (copiadas de todo-list-reusable.ts para mantener la consistencia)
export interface Tag {
  name: string;
  color: string;
}

export interface Task {
  id: number;
  text: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  completed: boolean;
  tags?: Tag[];
}

@Component({
  selector: 'app-search-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule], // No es necesario TodoListComponent aquí ya que solo mostramos la lista de tareas
  templateUrl: './search-tasks.html',
  styleUrl: './search-tasks.scss'
})
export class SearchTasksComponent implements OnInit {
  // Término de búsqueda enlazado al input
  searchTerm: string = '';
  
  // Lista de todas las tareas (se carga desde localStorage)
  allTasks: Task[] = [];
  
  // Lista de tareas filtradas para mostrar en la interfaz de usuario
  filteredTasks: Task[] = [];

  constructor() { }

  ngOnInit(): void {
    // Cargar todas las tareas desde localStorage al inicializar el componente
    this.loadAllTasksFromLocalStorage();
    // Inicialmente, mostrar todas las tareas
    this.filteredTasks = [...this.allTasks];
  }

  /**
   * Carga todas las tareas de todos los proyectos guardados en localStorage.
   * Itera sobre todas las claves para encontrar las que contienen listas de tareas.
   */
  loadAllTasksFromLocalStorage(): void {
    this.allTasks = []; // Reinicia la lista de tareas
    
    // Itera sobre todas las claves en localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Busca claves que sigan el patrón 'tasks-${projectId}'
      if (key && key.startsWith('tasks-')) {
        try {
          const storedTasks = localStorage.getItem(key);
          if (storedTasks) {
            const tasks = JSON.parse(storedTasks) as Task[];
            // Agrega las tareas de este proyecto a la lista general
            this.allTasks = this.allTasks.concat(tasks);
          }
        } catch (error) {
          console.error(`Error al parsear tareas desde la clave ${key}:`, error);
        }
      }
    }
  }

  /**
   * Método que se ejecuta cada vez que el usuario escribe.
   * Filtra las tareas basándose en el término de búsqueda.
   */
  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredTasks = [...this.allTasks];
    } else {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredTasks = this.allTasks.filter(task =>
        // Filtra por el texto de la tarea
        task.text.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  }
}
