// todo-list-reusable.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

// Interfaces para las estructuras de datos
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
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './todo-list-reusable.html',
  styleUrl: './todo-list-reusable.scss'
})
export class TodoListComponent implements OnInit {

  // Recibe la lista de tareas del componente padre
  // Ahora también se gestionará en el localStorage
  @Input() tasks: Task[] = [];

  // Emite eventos para que el padre gestione las acciones
  @Output() taskAdded = new EventEmitter<Omit<Task, 'id' | 'completed'>>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskToggled = new EventEmitter<Task>();

  taskForm: FormGroup;

  categories: string[] = [];
  showCategoryManagement = false;
  newCategoryName = '';
  newCategoryColor = '#6200ea';
  categoryColors: { [key: string]: string } = {};

  showTagManagement = false;
  newTagName = '';
  newTagColor = '#4caf50';
  tags: Tag[] = [];
  availableTags: string[] = [];
  taskTags: string[] = [];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      text: ['', Validators.required],
      date: [''],
      startTime: [''],
      endTime: [''],
      category: ['', Validators.required],
      tags: [[]]
    });
  }

  ngOnInit(): void {
    // 1. Cargar las tareas, categorías y etiquetas desde el localStorage
    this.loadDataFromLocalStorage();

    // 2. Establecer los valores iniciales en el formulario una vez que los datos estén cargados
    this.taskForm.get('category')?.setValue(this.categories[0]);
    this.taskForm.get('tags')?.setValue(this.taskTags);
  }

  /**
   * Carga los datos de tareas, categorías y etiquetas desde el localStorage.
   * Si no hay datos guardados, utiliza valores predeterminados.
   */
  private loadDataFromLocalStorage(): void {
    // Cargar Tareas
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    } else {
      // Si no hay tareas guardadas, usa un array vacío
      this.tasks = [];
    }

    // Cargar Categorías
    const savedCategories = localStorage.getItem('categories');
    const savedCategoryColors = localStorage.getItem('categoryColors');
    if (savedCategories && savedCategoryColors) {
      this.categories = JSON.parse(savedCategories);
      this.categoryColors = JSON.parse(savedCategoryColors);
    } else {
      // Valores predeterminados si no hay categorías guardadas
      this.categories = ['Work', 'Personal', 'Study', 'Shopping'];
      this.categoryColors = {
        'Work': '#6200ea',
        'Personal': '#03dac6',
        'Study': '#ffc107',
        'Shopping': '#e91e63'
      };
    }

    // Cargar Etiquetas
    const savedTags = localStorage.getItem('tags');
    if (savedTags) {
      this.tags = JSON.parse(savedTags);
    } else {
      // Valores predeterminados si no hay etiquetas guardadas
      this.tags = [
        { name: 'Urgente', color: '#f44336' },
        { name: 'Casi terminado', color: '#ffeb3b' },
        { name: 'Proyecto A', color: '#2196f3' },
        { name: 'Compras', color: '#e91e63' }
      ];
    }
    this.availableTags = this.tags.map(tag => tag.name);
  }

  /**
   * Guarda las tareas, categorías y etiquetas en el localStorage.
   */
  private saveDataToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('categories', JSON.stringify(this.categories));
    localStorage.setItem('categoryColors', JSON.stringify(this.categoryColors));
    localStorage.setItem('tags', JSON.stringify(this.tags));
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const newTask = this.taskForm.value;
      newTask.tags = this.tags.filter(tag => this.taskTags.includes(tag.name));
      this.taskAdded.emit(newTask);
      
      // Añadir la nueva tarea a la lista local y guardar
      this.tasks.push({ ...newTask, id: Date.now(), completed: false });
      this.saveDataToLocalStorage();

      this.taskForm.reset({ category: this.categories[0], tags: [] });
      this.taskTags = [];
    }
  }

  toggleCompleted(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveDataToLocalStorage();
      this.taskToggled.emit(updatedTask);
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveDataToLocalStorage();
    this.taskDeleted.emit(id);
  }

  editTask(task: Task): void {
    // Reemplazando `prompt` con una solución que no causa problemas en el entorno
    const newText = window.prompt("Edita la tarea:", task.text);
    if (newText !== null && newText.trim() !== '') {
      const updatedTask = { ...task, text: newText };
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
        this.saveDataToLocalStorage();
        this.taskUpdated.emit(updatedTask);
      }
    }
  }

  addCategory(): void {
    if (this.newCategoryName && !this.categories.includes(this.newCategoryName)) {
      this.categories.push(this.newCategoryName);
      this.categoryColors[this.newCategoryName] = this.newCategoryColor;
      this.taskForm.get('category')?.setValue(this.newCategoryName);
      this.newCategoryName = '';
      this.newCategoryColor = '#6200ea';
      this.saveDataToLocalStorage();
    }
  }

  deleteCategory(category: string): void {
    this.categories = this.categories.filter(cat => cat !== category);
    delete this.categoryColors[category];
    if (this.taskForm.get('category')?.value === category) {
      this.taskForm.get('category')?.setValue(this.categories[0]);
    }
    this.saveDataToLocalStorage();
  }

  public getCategoryColor(category: string | undefined): string {
    return (category && this.categoryColors[category]) || '#ffffff';
  }

  addTag(): void {
    if (this.newTagName && !this.tags.some(tag => tag.name === this.newTagName)) {
      const newTag: Tag = { name: this.newTagName, color: this.newTagColor };
      this.tags.push(newTag);
      this.availableTags = this.tags.map(tag => tag.name);
      this.newTagName = '';
      this.newTagColor = '#4caf50';
      this.saveDataToLocalStorage();
    }
  }

  deleteTag(tagName: string): void {
    this.tags = this.tags.filter(tag => tag.name !== tagName);
    this.availableTags = this.tags.map(tag => tag.name);
    this.taskTags = this.taskTags.filter(tag => tag !== tagName);
    this.taskForm.get('tags')?.setValue(this.taskTags);
    this.saveDataToLocalStorage();
  }

  onTagSelected(event: any): void {
    const selectedTag = event.target.value;
    if (selectedTag && selectedTag !== '' && !this.taskTags.includes(selectedTag)) {
      this.taskTags.push(selectedTag);
      this.taskForm.get('tags')?.setValue(this.taskTags);
      event.target.value = '';
    }
  }

  removeTaskTag(tagName: string): void {
    this.taskTags = this.taskTags.filter(tag => tag !== tagName);
    this.taskForm.get('tags')?.setValue(this.taskTags);
  }

  public getTagColor(tagName: string | undefined): string {
    return this.tags.find(tag => tag.name === tagName)?.color || '#9e9e9e';
  }
}
