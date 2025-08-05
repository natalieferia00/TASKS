import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Componentes
import { DashboardComponent } from './components/dashboard/dashboard';
import { HabitsComponent } from './components/tasks/tasks';
import { TabsComponent } from './components/tabs/tabs';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

// Servicio de autenticación
import { AuthService } from './services/auth';

/**
 * Guard para rutas protegidas. Redirige al login si el usuario no está autenticado.
 */
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
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas protegidas dentro del layout TabsComponent
  {
    path: '',
    component: TabsComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tasks', component: HabitsComponent },
      // Puedes agregar más rutas protegidas aquí:
      // { path: 'projects', component: ProjectsComponent },
      // { path: 'profile', component: ProfileComponent },
    ]
  },

  // Ruta comodín (fallback)
  { path: '**', redirectTo: 'login' }
];
