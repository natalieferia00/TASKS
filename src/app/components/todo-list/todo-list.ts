import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Definimos la interfaz para la tarea para asegurar la estructura
interface Task {
    id: number;
    text: string;
    category: string;
    completed: boolean;
    color: string;
}

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './todo-list.html',
    styleUrl: './todo-list.scss'
})
export class TodoListComponent implements OnInit {

    // Formulario para crear nuevas tareas
    taskForm: FormGroup;
    
    // Array para almacenar las tareas
    tasks: Task[] = [];
    
    // ID para asignar a las nuevas tareas
    nextId = 1;

    // Colores para las categorías
    categoryColors: { [key: string]: string } = {
        'Work': '#a000fe',
        'Personal': '#ffffffff',
        'Study': '#858383ff',
        'Shopping': '#c5c5c5ff'
    };
    
    // Categorías disponibles
    categories: string[] = ['Work', 'Personal', 'Study', 'Shopping'];

    constructor(private fb: FormBuilder) {
        // Inicializamos el formulario con campos y validadores
        this.taskForm = this.fb.group({
            text: ['', Validators.required],
            category: [this.categories[0], Validators.required]
        });
    }

    ngOnInit(): void {
        // Al iniciar, cargamos las tareas desde el almacenamiento local si existen
        this.loadTasks();
    }

    // Cargar tareas del almacenamiento local (localStorage)
    loadTasks(): void {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
            // Aseguramos que el nextId sea mayor que los IDs existentes
            const maxId = this.tasks.reduce((max, task) => Math.max(max, task.id), 0);
            this.nextId = maxId + 1;
        }
    }

    // Guardar tareas en el almacenamiento local
    saveTasks(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Método para agregar una nueva tarea
    addTask(): void {
        if (this.taskForm.valid) {
            const newTask: Task = {
                id: this.nextId++,
                text: this.taskForm.value.text,
                category: this.taskForm.value.category,
                completed: false,
                color: this.categoryColors[this.taskForm.value.category]
            };
            this.tasks.push(newTask);
            this.saveTasks();
            this.taskForm.reset({ category: this.categories[0] }); // Reseteamos el formulario
        }
    }

    // Método para marcar una tarea como completada
    toggleCompleted(task: Task): void {
        task.completed = !task.completed;
        this.saveTasks();
    }

    // Método para eliminar una tarea
    deleteTask(id: number): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }
    
    // Método para editar una tarea (simplemente la marcamos para no confundir con un form de edición en línea)
    editTask(task: Task): void {
        const newText = prompt("Edita la tarea:", task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText;
            this.saveTasks();
        }
    }
}
