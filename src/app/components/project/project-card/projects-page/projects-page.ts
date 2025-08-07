import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // Para la navegación a tareas del proyecto
import { ProjectService } from '../../../../services/project.service';

// Definición de interfaces para los modelos de datos (pueden estar en un archivo compartido)
interface Task {
    id: number;
    text: string;
    completed: boolean;
}

interface Project {
    id: number;
    name: string;
    taskCount: number;
    icon: string;
    chartIcon: string;
    members: string[];
    extraMembers: number;
    color: string;
    tasks: Task[];
}

@Component({
    selector: 'app-projects-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink], // Importa RouterLink
    templateUrl: './projects-page.html',
    styleUrl: './projects-page.scss'
})
export class ProjectsPageComponent implements OnInit {
    private projectService = inject(ProjectService);
    private fb = inject(FormBuilder);

    projects: Project[] = []; // Lista de proyectos
    newProjectForm: FormGroup; // Formulario para añadir nuevos proyectos

    constructor() {
        // Inicializar el formulario para el nuevo proyecto
        this.newProjectForm = this.fb.group({
            projectName: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadProjects(); // Cargar los proyectos al iniciar
    }

    // Cargar los proyectos desde el servicio
    loadProjects(): void {
        this.projects = this.projectService.getProjects();
    }

    // Método para agregar un nuevo proyecto
    addNewProject(): void {
        if (this.newProjectForm.valid) {
            const projectName = this.newProjectForm.value.projectName;
            this.projectService.addProject(projectName);
            this.loadProjects(); // Volver a cargar los proyectos para actualizar la vista
            this.newProjectForm.reset(); // Limpiar el formulario
        }
    }

    // Método para eliminar un proyecto
    deleteProject(event: Event, projectId: number): void {
        event.stopPropagation(); // Evita que el routerLink se active al hacer clic en el icono de eliminar
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto y todas sus tareas?')) {
            this.projectService.deleteProject(projectId);
            this.loadProjects(); // Volver a cargar los proyectos para actualizar la vista
        }
    }

    // Método para editar un proyecto (solo el nombre por ahora)
    editProject(event: Event, project: Project): void {
        event.stopPropagation(); // Evita que el routerLink se active
        const newName = prompt("Edita el nombre del proyecto:", project.name);
        if (newName !== null && newName.trim() !== '') {
            const updatedProject = { ...project, name: newName };
            this.projectService.updateProject(updatedProject);
            this.loadProjects(); // Actualizar la lista
        }
    }
}
