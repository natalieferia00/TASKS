import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import { AuthService } from '../../services/auth';


@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule, ],
    templateUrl: './tabs.html',
    styleUrl: './tabs.scss'
})
export class TabsComponent {
    // Inyectamos el servicio de autenticación
    private authService = inject(AuthService);

    // Método que llama al servicio para cerrar la sesión
    logout() {
        this.authService.logout();
    }
}
