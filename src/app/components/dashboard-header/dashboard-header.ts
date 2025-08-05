import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-dashboard-header',
    standalone: true,
    imports: [],
    templateUrl: './dashboard-header.html',
    styleUrl: './dashboard-header.scss'
})
export class DashboardHeaderComponent {
    // Usamos @Input para recibir los datos del componente padre (DashboardComponent).
    @Input() user: any;
}
