import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private router: Router) { }

    // Función para obtener el usuario actualmente logueado desde localStorage.
    getCurrentUser(): any | null {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Función para verificar si un usuario está autenticado.
    isLoggedIn(): boolean {
        return !!localStorage.getItem('currentUser');
    }

    // Función para el registro de nuevos usuarios.
    // Almacenamos un array de usuarios en localStorage.
    register(user: any): boolean {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find((u: any) => u.email === user.email)) {
            return false; // El usuario ya existe.
        }
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        this.login(user);
        return true;
    }

    // Función para el inicio de sesión.
    // Si las credenciales coinciden, guardamos el usuario en 'currentUser'.
    login(user: any): boolean {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: any) => u.email === user.email && u.password === user.password);

        if (foundUser) {
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            return true;
        }
        return false;
    }

    // Función para cerrar la sesión.
    // Simplemente elimina el usuario de 'currentUser' en localStorage y redirige al login.
    logout(): void {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}
