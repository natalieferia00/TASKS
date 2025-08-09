import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí

interface Task {
  id: number;
  text: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  completed: boolean;
  color: string;
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Agrega FormsModule a los imports
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoListComponent implements OnInit {
  taskForm: FormGroup;
  tasks: Task[] = [];
  nextId = 1;

  categoryColors: { [key: string]: string } = {
    Work: '#a000fe',
    Personal: '#ffffff',
    Study: '#858383ff',
    Shopping: '#c5c5c5ff',
  };

  categories: string[] = ['Work', 'Personal', 'Study', 'Shopping'];

  newCategoryName: string = '';
  newCategoryColor: string = '#a000fe';
  showNewCategoryInput: boolean = false;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      text: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      category: [this.categories[0], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      const maxId = this.tasks.reduce((max, task) => Math.max(max, task.id), 0);
      this.nextId = maxId + 1;
    }

    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    }

    const storedCategoryColors = localStorage.getItem('categoryColors');
    if (storedCategoryColors) {
      this.categoryColors = JSON.parse(storedCategoryColors);
    }

    if (this.categories.length > 0) {
      this.taskForm.get('category')?.setValue(this.categories[0]);
    }
  }

  saveData(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('categories', JSON.stringify(this.categories));
    localStorage.setItem('categoryColors', JSON.stringify(this.categoryColors));
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const categoryName = this.taskForm.value.category;
      const newTask: Task = {
        id: this.nextId++,
        text: this.taskForm.value.text,
        date: this.taskForm.value.date,
        startTime: this.taskForm.value.startTime,
        endTime: this.taskForm.value.endTime,
        category: categoryName,
        completed: false,
        color: this.categoryColors[categoryName],
      };
      this.tasks.push(newTask);
      this.saveData();
      this.taskForm.reset({ category: this.categories[0] });
    }
  }

  toggleCompleted(task: Task): void {
    task.completed = !task.completed;
    this.saveData();
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveData();
  }

  editTask(task: Task): void {
    const newText = prompt('Edita la tarea:', task.text);
    if (newText !== null && newText.trim() !== '') {
      task.text = newText;
      this.saveData();
    }
  }

  addCategory(): void {
    if (this.newCategoryName && !this.categories.includes(this.newCategoryName)) {
      this.categories.push(this.newCategoryName);
      this.categoryColors[this.newCategoryName] = this.newCategoryColor;
      this.saveData();
      this.taskForm.get('category')?.setValue(this.newCategoryName);
      this.newCategoryName = '';
      this.newCategoryColor = '#a000fe';
      this.showNewCategoryInput = false;
    }
  }
}
