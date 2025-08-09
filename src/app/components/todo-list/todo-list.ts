import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

/**
 * Interface que define la estructura de una tarea.
 */
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
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './todo-list.html',
    styleUrl: './todo-list.scss',
})
export class TodoListComponent implements OnInit {
    // FormGroup para manejar los datos del formulario de la nueva tarea
    taskForm: FormGroup;
    // Array que almacena todas las tareas
    tasks: Task[] = [];
    // Contador para asignar un ID único a cada nueva tarea
    nextId = 1;

    // Mapa para asociar categorías con colores
    categoryColors: { [key: string]: string } = {
        Work: '#a000fe',
        Personal: '#ffffff',
        Study: '#858383ff',
        Shopping: '#c5c5c5ff',
    };
    
    // Array con las categorías de tareas
    categories: string[] = ['Work', 'Personal', 'Study', 'Shopping'];

    // Variables para manejar la creación y gestión de categorías
    newCategoryName: string = '';
    newCategoryColor: string = '#a000fe';
    showNewCategoryInput: boolean = false;
    showCategoryManagement: boolean = false;

    constructor(private fb: FormBuilder) {
        // Inicializa el formulario con los campos y validadores
        this.taskForm = this.fb.group({
            text: ['', Validators.required],
            date: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            category: [this.categories[0], Validators.required],
        });
    }

    ngOnInit(): void {
        // Carga los datos guardados en el almacenamiento local al iniciar el componente
        this.loadData();
    }

    /**
     * Carga las tareas, categorías y colores desde el localStorage.
     */
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

    /**
     * Guarda las tareas, categorías y colores en el localStorage.
     */
    saveData(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('categories', JSON.stringify(this.categories));
        localStorage.setItem('categoryColors', JSON.stringify(this.categoryColors));
    }

    /**
     * Añade una nueva tarea a la lista si el formulario es válido.
     */
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
            this.saveData(); // Guarda los cambios en el localStorage
            this.taskForm.reset({ category: this.categories[0] });
        }
    }

    /**
     * Alterna el estado de completado de una tarea.
     * @param task La tarea a modificar.
     */
    toggleCompleted(task: Task): void {
        task.completed = !task.completed;
        this.saveData(); // Guarda los cambios en el localStorage
    }

    /**
     * Elimina una tarea de la lista.
     * @param id El ID de la tarea a eliminar.
     */
    deleteTask(id: number): void {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.saveData(); // Guarda los cambios en el localStorage
    }

    /**
     * Edita el texto de una tarea.
     * @param task La tarea a editar.
     */
    editTask(task: Task): void {
        const newText = prompt('Edita la tarea:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText;
            this.saveData(); // Guarda los cambios en el localStorage
        }
    }

    /**
     * Añade una nueva categoría a la lista.
     */
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

    /**
     * Elimina una categoría de la lista.
     * @param categoryToDelete El nombre de la categoría a eliminar.
     */
    deleteCategory(categoryToDelete: string): void {
        const index = this.categories.indexOf(categoryToDelete);
        if (index > -1) {
            this.categories.splice(index, 1);
            delete this.categoryColors[categoryToDelete];

            // Asigna una categoría predeterminada a las tareas que tenían la categoría eliminada
            const defaultCategory = this.categories.length > 0 ? this.categories[0] : '';
            this.tasks.forEach(task => {
                if (task.category === categoryToDelete) {
                    task.category = defaultCategory;
                    task.color = this.categoryColors[defaultCategory] || '#a0a0a0'; // Color gris por defecto
                }
            });

            // Actualiza el valor del formulario si la categoría eliminada era la seleccionada
            if (this.taskForm.get('category')?.value === categoryToDelete) {
                this.taskForm.get('category')?.setValue(defaultCategory);
            }

            this.saveData();
        }
    }
}
