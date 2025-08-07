import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export interface Task {
  id: number;
  text: string;
  date?: string; // Hacemos estas propiedades opcionales para mayor flexibilidad
  category?: string;
  completed: boolean;
  color?: string;
}

@Component({
  selector: 'app-todo-list-reusable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-list-reusable.html',
  styleUrl: './todo-list-reusable.scss'
})
export class TodoListReusableComponent implements OnInit {

  @Input() tasks: Task[] = [];
  @Output() taskAdded = new EventEmitter<Omit<Task, 'id' | 'completed'>>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskToggled = new EventEmitter<Task>();

  taskForm: FormGroup;
  categories: string[] = ['Work', 'Personal', 'Study', 'Shopping'];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      text: ['', Validators.required],
      date: [''], // Campo opcional
      category: [this.categories[0], Validators.required]
    });
  }

  ngOnInit(): void {}

  addTask(): void {
    if (this.taskForm.valid) {
      const newTask = {
        text: this.taskForm.value.text,
        date: this.taskForm.value.date,
        category: this.taskForm.value.category,
        color: this.getCategoryColor(this.taskForm.value.category)
      };
      this.taskAdded.emit(newTask);
      this.taskForm.reset({ category: this.categories[0] });
    }
  }

  toggleCompleted(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskToggled.emit(updatedTask);
  }

  deleteTask(id: number): void {
    this.taskDeleted.emit(id);
  }

  editTask(task: Task): void {
    const newText = prompt("Edita la tarea:", task.text);
    if (newText !== null && newText.trim() !== '') {
      const updatedTask = { ...task, text: newText };
      this.taskUpdated.emit(updatedTask);
    }
  }

  private getCategoryColor(category: string): string {
    const categoryColors: { [key: string]: string } = {
      'Work': '#a000fe',
      'Personal': '#ffffff',
      'Study': '#858383ff',
      'Shopping': '#c5c5c5ff'
    };
    return categoryColors[category] || '#ffffff';
  }
}