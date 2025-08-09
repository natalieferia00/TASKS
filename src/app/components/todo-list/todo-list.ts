import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

interface Task {
  id: number;
  text: string;
  date: string;
  // Nuevas propiedades para la hora de inicio y fin
  startTime: string;
  endTime: string;
  category: string;
  completed: boolean;
  color: string;
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      text: ['', Validators.required],
      date: ['', Validators.required],
      // Nuevos campos para la hora de inicio y fin
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      category: [this.categories[0], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      const maxId = this.tasks.reduce((max, task) => Math.max(max, task.id), 0);
      this.nextId = maxId + 1;
    }
  }

  saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: this.nextId++,
        text: this.taskForm.value.text,
        date: this.taskForm.value.date,
        // Agregamos los nuevos valores del formulario
        startTime: this.taskForm.value.startTime,
        endTime: this.taskForm.value.endTime,
        category: this.taskForm.value.category,
        completed: false,
        color: this.categoryColors[this.taskForm.value.category],
      };
      this.tasks.push(newTask);
      this.saveTasks();
      this.taskForm.reset({ category: this.categories[0] });
    }
  }

  toggleCompleted(task: Task): void {
    task.completed = !task.completed;
    this.saveTasks();
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }

  editTask(task: Task): void {
    const newText = prompt('Edita la tarea:', task.text);
    if (newText !== null && newText.trim() !== '') {
      task.text = newText;
      this.saveTasks();
    }
  }
}
