import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    // Asegúrate de que RouterOutlet esté en el arreglo de imports.
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class AppComponent {
    title = 'tasks';
}
