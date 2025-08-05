import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Importamos todos los componentes
import { DashboardComponent } from './components/dashboard/dashboard';
import { Tasks } from './components/tasks/tasks';
import { TabsComponent } from './components/tabs/tabs';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

// Importamos el servicio de autenticación
import { AuthService } from './services/auth';

/**
 * Este 'guard' protege las rutas para que solo los usuarios autenticados
 * puedan acceder. Si un usuario no está logueado, lo redirige al login.
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si el usuario está logueado, permite la navegación.
    if (authService.isLoggedIn()) {
        return true;
    } else {
        // Si no está logueado, lo redirige a la página de login.
        router.navigate(['/login']);
        return false;
    }
};

export const routes: Routes = [
    // Definimos las rutas públicas para el login y el registro, que no
    // necesitan el guard, ya que son para usuarios no autenticados.
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Esta es la ruta principal. El 'TabsComponent' actúa como el layout
    // que contiene todas las demás páginas protegidas de la aplicación.
    {
        path: '',
        component: DashboardComponent,
        // Solo los usuarios autenticados pueden acceder a esta rama de rutas
        canActivate: [authGuard],
        children: [
            // Cuando la ruta es '', redirigimos inmediatamente al dashboard.
            // Esto asegura que el Dashboard sea la primera pantalla que el
            // usuario ve después de iniciar sesión.
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            // Ruta para la vista del Dashboard. Se renderiza dentro del TabsComponent.
            { path: 'dashboard', component: DashboardComponent },
            // Ruta para la vista de Tareas. Se renderiza también dentro del TabsComponent.
            { path: 'tasks', component: Tasks},
        ]
    },

    // Esta es la ruta de comodín. Si el usuario intenta acceder a una URL
    // que no coincide con ninguna ruta anterior, lo redirigimos al login
    // para manejar el caso.
    { path: '**', redirectTo: 'login' }
];
