import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definición de la interfaz para un evento o tarea de calendario
interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  startTime: string; // Nuevo campo para la hora de inicio
  endTime: string;   // Nuevo campo para la hora de fin
  completed: boolean;
}

// Interfaz para la tarea guardada en localStorage (date es string)
interface StoredTask {
  id: number;
  text: string;
  date: string;
  startTime: string; // Nuevo campo para la hora de inicio
  endTime: string;   // Nuevo campo para la hora de fin
  category: string;
  completed: boolean;
  color: string;
}

@Component({
  selector: 'app-calendar-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-list.html',
  styleUrl: './calendar-list.scss'
})
export class CalendarListComponent implements OnInit {
  activeFilter: 'today' | 'week' | 'month' = 'today';
  currentDate = new Date();
  
  // Lista de eventos que se cargará desde localStorage
  events: CalendarEvent[] = [];
  
  // Eventos filtrados para la vista
  filteredEvents: CalendarEvent[] = [];

  constructor() { }

  ngOnInit(): void {
    // Cargar los eventos al iniciar el componente
    this.loadEvents();
    // Filtra por 'hoy' al cargar el componente
    this.filterEvents('today');
  }

  // Carga las tareas desde localStorage y las convierte al formato CalendarEvent
  loadEvents(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks: StoredTask[] = JSON.parse(storedTasks);
      this.events = parsedTasks.map(task => ({
        id: task.id,
        title: task.text,
        date: new Date(task.date), // Convertir la fecha de string a objeto Date
        startTime: task.startTime, // Asignar el nuevo campo
        endTime: task.endTime,     // Asignar el nuevo campo
        completed: task.completed,
      }));
    }
  }
  
  // Guarda los eventos en localStorage después de un cambio
  saveEvents(): void {
    // Al guardar, convertimos la fecha de Date a un formato de string ISO para que JSON.stringify funcione correctamente
    const tasksToSave = this.events.map(event => ({
      id: event.id,
      text: event.title,
      date: event.date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      startTime: event.startTime, // Guardar el nuevo campo
      endTime: event.endTime,     // Guardar el nuevo campo
      category: 'General', // O una categoría por defecto
      completed: event.completed,
      color: '#ffffff' // O un color por defecto
    }));
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
  }
  
  filterEvents(filter: 'today' | 'week' | 'month'): void {
    // Recargar los eventos de localStorage para asegurar la sincronización
    this.loadEvents();
    this.activeFilter = filter;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      switch (this.activeFilter) {
        case 'today':
          return eventDate.getTime() === today.getTime();
        case 'week':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        case 'month':
          return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });

    this.filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  toggleCompletion(event: CalendarEvent): void {
    // Encuentra la tarea en la lista principal y actualiza su estado
    const taskToUpdate = this.events.find(e => e.id === event.id);
    if (taskToUpdate) {
      taskToUpdate.completed = !taskToUpdate.completed;
      this.saveEvents(); // Guarda el cambio en localStorage
    }
  }
}
