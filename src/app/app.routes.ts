import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Importamos todos los componentes
import { DashboardComponent } from './components/dashboard/dashboard';
import { HabitsComponent } from './components/tasks/tasks';
import { TabsComponent } from './components/tabs/tabs';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TodoListComponent } from './components/todo-list/todo-list';
import { ProjectsPageComponent } from './components/project/project-card/projects-page/projects-page';
import { ProjectDetailComponent } from './projects/project-detail/project-detail'; // <--- Nueva importación para ProjectDetail

// Importamos el servicio de autenticación
import { AuthService } from './services/auth';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {
        path: '',
        component: TabsComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'tasks', component: HabitsComponent },
            { path: 'todo', component: TodoListComponent },
            { path: 'projects', component: ProjectsPageComponent },
            { path: 'project-tasks/:id', component: ProjectDetailComponent }, // <--- Nueva ruta para la vista de detalle
        ]
    },

    { path: '**', redirectTo: 'login' }
];