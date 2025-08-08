import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definición de la interfaz para una tarea
interface Task {
  id: number;
  name: string;
  completed: boolean;
  dueDate: string;
}

@Component({
  selector: 'app-search-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-tasks.html',
  styleUrl: './search-tasks.scss'
})
export class SearchTasksComponent implements OnInit {
  // Término de búsqueda enlazado al input
  searchTerm: string = '';
  
  // Lista de todas las tareas (aquí es de ejemplo, podrías inyectar un servicio)
  allTasks: Task[] = [
    { id: 1, name: 'Planificar campaña de marketing', completed: false, dueDate: '2025-08-20' },
    { id: 2, name: 'Diseñar la landing page', completed: true, dueDate: '2025-08-15' },
    { id: 3, name: 'Escribir el contenido del blog', completed: false, dueDate: '2025-08-22' },
    { id: 4, name: 'Configurar el servidor de producción', completed: false, dueDate: '2025-08-25' },
    { id: 5, name: 'Revisar métricas de la última campaña', completed: true, dueDate: '2025-08-18' },
  ];
  
  // Lista de tareas filtradas para mostrar en la interfaz de usuario
  filteredTasks: Task[] = [];

  constructor() { }

  ngOnInit(): void {
    // Inicialmente, mostrar todas las tareas
    this.filteredTasks = [...this.allTasks];
  }

  // Método que se ejecuta cada vez que el usuario escribe
  onSearch(): void {
    // Si el término de búsqueda está vacío, mostrar todas las tareas
    if (!this.searchTerm) {
      this.filteredTasks = [...this.allTasks];
      return;
    }

    // Filtrar las tareas basándose en el término de búsqueda
    this.filteredTasks = this.allTasks.filter(task =>
      task.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Método para manejar el cambio del checkbox
  onTaskCompletionChange(task: Task): void {
    console.log(`Tarea "${task.name}" completada: ${task.completed}`);
    // Aquí puedes agregar lógica adicional, como llamar a un servicio para guardar el cambio
  }
}
