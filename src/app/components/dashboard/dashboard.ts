import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

import { DashboardHeaderComponent } from "../dashboard-header/dashboard-header";
import { TabsComponent } from "../tabs/tabs";
import { TodoListComponent } from "../todo-list/todo-list";
import { AuthService } from '../../services/auth';
import { ProjectService } from '../../services/project.service';
import { SearchTasksComponent } from "../search-bar/search-bar";
import { ProgressChartComponent } from "../progress-chart/progress-chart";
import { CalendarListComponent } from "../calendar-list/calendar-list";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
    CommonModule,
    DashboardHeaderComponent,
    TodoListComponent,
    ReactiveFormsModule,
    SearchTasksComponent,
    ProgressChartComponent,
    CalendarListComponent,
       RouterModule
],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
addNewProject() {
throw new Error('Method not implemented.');
}
    private authService = inject(AuthService);
    private projectService = inject(ProjectService);
    private fb = inject(FormBuilder);

    currentUser: any | null = null;
    projects: any[] = [];
    
    newProjectForm: FormGroup;

    constructor() {
        this.newProjectForm = this.fb.group({
            projectName: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
            if (!this.currentUser.profileImage) {
                this.currentUser.profileImage = 'https://placehold.co/100x100/4B6CB7/FFFFFF?text=User';
            }
            this.currentUser.taskCount = 5; // Esto podría ser dinámico según las tareas totales del usuario
        }

        this.loadProjects(); // Cargar los proyectos al iniciar
    }

    // Método para cargar los proyectos desde el servicio
    loadProjects(): void {
        this.projects = this.projectService.getProjects();
    }

 

    // Método para eliminar un proyecto
    deleteProject(event: Event, projectId: number): void {
        event.stopPropagation(); // Evita que el routerLink se active al hacer clic en el icono de eliminar
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto y todas sus tareas?')) {
            this.projectService.deleteProject(projectId);
            this.loadProjects(); // Volver a cargar los proyectos para actualizar la vista
        }
    }
}
