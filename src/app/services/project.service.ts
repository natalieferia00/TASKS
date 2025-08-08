import { Injectable } from '@angular/core';

// Definición de interfaces para los modelos de datos
export interface Task {
    id: number;
    text: string;
    completed: boolean;
}

export interface Project {
    id: number;
    name: string;
    taskCount: number;
    icon: string; // Icono para la tarjeta del proyecto
    chartIcon: string; // Icono de gráfico para la tarjeta
    members: string[]; // URLs de las imágenes de los miembros
    extraMembers: number;
    color: string; // Clase de color para la tarjeta
    tasks: Task[]; // Tareas específicas de este proyecto
}

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private projects: Project[] = [];
    private nextProjectId = 1;
    private nextTaskId = 1; // Para las tareas dentro de cada proyecto

    constructor() {
        this.loadProjects();
    }

    // Cargar proyectos desde localStorage
    private loadProjects(): void {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            this.projects = JSON.parse(storedProjects);
            // Asegurarse de que los IDs continúen correctamente
            const maxProjectId = this.projects.reduce((max, p) => Math.max(max, p.id), 0);
            this.nextProjectId = maxProjectId + 1;

            // También inicializar nextTaskId para cada proyecto
            this.projects.forEach(project => {
                const maxTaskId = project.tasks.reduce((max, t) => Math.max(max, t.id), 0);
                if (maxTaskId >= this.nextTaskId) {
                    this.nextTaskId = maxTaskId + 1;
                }
            });
        } else {
            // Si no hay proyectos, inicializar con algunos de ejemplo
            this.projects = [
                {
                    id: this.nextProjectId++,
                    name: 'App Design',
                    taskCount: 24,
                    icon: 'fa-solid fa-mobile-alt',
                    chartIcon: 'fa-solid fa-chart-bar',
                    members: [
                        'https://placehold.co/40x40/5A8BFD/FFFFFF?text=J',
                        'https://placehold.co/40x40/7C63C4/FFFFFF?text=M',
                        'https://placehold.co/40x40/F5826A/FFFFFF?text=A'
                    ],
                    extraMembers: 2,
                    color: 'app-design-card',
                    tasks: [
                        { id: 1, text: 'Diseñar interfaz de usuario', completed: false },
                        { id: 2, text: 'Crear prototipo interactivo', completed: true }
                    ]
                },
                {
                    id: this.nextProjectId++,
                    name: 'Dashboard',
                    taskCount: 36,
                    icon: 'fa-solid fa-chart-line',
                    chartIcon: 'fa-solid fa-chart-pie',
                    members: [
                        'https://placehold.co/40x40/5A8BFD/FFFFFF?text=J',
                        'https://placehold.co/40x40/7C63C4/FFFFFF?text=M',
                        'https://placehold.co/40x40/F5826A/FFFFFF?text=A'
                    ],
                    extraMembers: 2,
                    color: 'dashboard-card',
                    tasks: [
                        { id: 1, text: 'Implementar gráficos de ventas', completed: false },
                        { id: 2, text: 'Conectar a la API de datos', completed: false }
                    ]
                }
            ];
            this.saveProjects();
        }
    }

    // Guardar proyectos en localStorage
    private saveProjects(): void {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    // Obtener todos los proyectos
    getProjects(): Project[] {
        return this.projects;
    }

    // Obtener un proyecto por su ID
    getProjectById(id: number): Project | undefined {
        return this.projects.find(p => p.id === id);
    }

    // Agregar un nuevo proyecto
    addProject(name: string,): Project {
        const newProject: Project = {
            id: this.nextProjectId++,
            name: name,
            taskCount: 0, // Inicialmente 0 tareas
            icon: 'fa-solid fa-folder', // Icono por defecto para nuevos proyectos
            chartIcon: 'fa-solid fa-chart-simple',
            members: [],
            extraMembers: 0,
            color: 'default-card', // Clase de color por defecto
            tasks: []
        };
        this.projects.push(newProject);
        this.saveProjects();
        return newProject;
    }

    // Actualizar un proyecto
    updateProject(updatedProject: Project): void {
        const index = this.projects.findIndex(p => p.id === updatedProject.id);
        if (index !== -1) {
            this.projects[index] = updatedProject;
            this.saveProjects();
        }
    }

    // Eliminar un proyecto
    deleteProject(id: number): void {
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveProjects();
    }

    // Métodos para gestionar tareas dentro de un proyecto
    addTaskToProject(projectId: number, text: string): void {
        const project = this.getProjectById(projectId);
        if (project) {
            const newTask: Task = {
                id: this.nextTaskId++,
                text: text,
                completed: false
            };
            project.tasks.push(newTask);
            project.taskCount = project.tasks.length; // Actualizar el contador de tareas
            this.saveProjects();
        }
    }

    toggleTaskCompletion(projectId: number, taskId: number): void {
        const project = this.getProjectById(projectId);
        if (project) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                this.saveProjects();
            }
        }
    }

    updateProjectTask(projectId: number, updatedTask: Task): void {
        const project = this.getProjectById(projectId);
        if (project) {
            const index = project.tasks.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
                project.tasks[index] = updatedTask;
                this.saveProjects();
            }
        }
    }

    deleteProjectTask(projectId: number, taskId: number): void {
        const project = this.getProjectById(projectId);
        if (project) {
            project.tasks = project.tasks.filter(t => t.id !== taskId);
            project.taskCount = project.tasks.length; // Actualizar el contador de tareas
            this.saveProjects();
        }
    }
}
