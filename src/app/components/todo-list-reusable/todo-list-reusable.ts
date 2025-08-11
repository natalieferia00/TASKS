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

  @Input() projectId: number | undefined;

  // Recibe la lista de tareas del componente padre
  @Input() tasks: Task[] = [];
  
  // Lista de tareas filtradas para mostrar en la UI
  filteredTasks: Task[] = [];
  
  // Término de búsqueda
  searchTerm: string = '';

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
    // 1. Cargar los datos desde el localStorage
    this.loadDataFromLocalStorage();

    // 2. Inicializar la lista de tareas filtradas con todas las tareas
    this.filteredTasks = [...this.tasks];
    
    // 3. Establecer los valores iniciales en el formulario
    if (this.categories.length > 0) {
      this.taskForm.get('category')?.setValue(this.categories[0]);
    }
    this.taskForm.get('tags')?.setValue(this.taskTags);
  }

  /**
   * Carga los datos de tareas, categorías y etiquetas desde el localStorage.
   * Si no hay datos guardados, utiliza valores predeterminados.
   */
  private loadDataFromLocalStorage(): void {
    if (!this.projectId) {
      this.tasks = [];
      this.categories = ['Work', 'Personal', 'Study', 'Shopping'];
      this.categoryColors = { 'Work': '#6200ea', 'Personal': '#03dac6', 'Study': '#ffc107', 'Shopping': '#e91e63' };
      this.tags = [{ name: 'Urgente', color: '#f44336' }, { name: 'Casi terminado', color: '#ffeb3b' }, { name: 'Proyecto A', color: '#2196f3' }, { name: 'Compras', color: '#e91e63' }];
      this.availableTags = this.tags.map(tag => tag.name);
      return;
    }

    const tasksKey = `tasks-${this.projectId}`;
    const categoriesKey = `categories-${this.projectId}`;
    const categoryColorsKey = `categoryColors-${this.projectId}`;
    const tagsKey = `tags-${this.projectId}`;

    // Cargar Tareas
    const savedTasks = localStorage.getItem(tasksKey);
    this.tasks = savedTasks ? JSON.parse(savedTasks) : [];

    // Cargar Categorías
    const savedCategories = localStorage.getItem(categoriesKey);
    const savedCategoryColors = localStorage.getItem(categoryColorsKey);
    if (savedCategories && savedCategoryColors) {
      this.categories = JSON.parse(savedCategories);
      this.categoryColors = JSON.parse(savedCategoryColors);
    } else {
      this.categories = ['Work', 'Personal', 'Study', 'Shopping'];
      this.categoryColors = { 'Work': '#6200ea', 'Personal': '#03dac6', 'Study': '#ffc107', 'Shopping': '#e91e63' };
    }

    // Cargar Etiquetas
    const savedTags = localStorage.getItem(tagsKey);
    if (savedTags) {
      this.tags = JSON.parse(savedTags);
    } else {
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
    if (!this.projectId) return;

    const tasksKey = `tasks-${this.projectId}`;
    const categoriesKey = `categories-${this.projectId}`;
    const categoryColorsKey = `categoryColors-${this.projectId}`;
    const tagsKey = `tags-${this.projectId}`;

    localStorage.setItem(tasksKey, JSON.stringify(this.tasks));
    localStorage.setItem(categoriesKey, JSON.stringify(this.categories));
    localStorage.setItem(categoryColorsKey, JSON.stringify(this.categoryColors));
    localStorage.setItem(tagsKey, JSON.stringify(this.tags));
  }
  
  /**
   * Filtra las tareas según el término de búsqueda.
   */
  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredTasks = [...this.tasks];
    } else {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredTasks = this.tasks.filter(task =>
        task.text.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const newTask = this.taskForm.value;
      newTask.tags = this.tags.filter(tag => this.taskTags.includes(tag.name));

      this.tasks.push({ ...newTask, id: Date.now(), completed: false });
      this.saveDataToLocalStorage();

      this.taskAdded.emit(newTask);
      this.taskForm.reset({ category: this.categories[0], tags: [] });
      this.taskTags = [];
      
      // Actualiza la lista filtrada después de añadir una tarea
      this.onSearch();
    }
  }

  toggleCompleted(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveDataToLocalStorage();
      this.taskToggled.emit(updatedTask);
      // Actualiza la lista filtrada después de alternar el estado
      this.onSearch();
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveDataToLocalStorage();
    this.taskDeleted.emit(id);
    // Actualiza la lista filtrada después de eliminar una tarea
    this.onSearch();
  }

  editTask(task: Task): void {
    const newText = window.prompt("Edita la tarea:", task.text);
    if (newText !== null && newText.trim() !== '') {
      const updatedTask = { ...task, text: newText };
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
        this.saveDataToLocalStorage();
        this.taskUpdated.emit(updatedTask);
        // Actualiza la lista filtrada después de editar una tarea
        this.onSearch();
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