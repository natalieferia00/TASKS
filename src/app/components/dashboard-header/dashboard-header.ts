import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.scss'
})
export class DashboardHeaderComponent {
  // Usamos @Input para recibir los datos del componente padre (DashboardComponent).
  @Input() user: any;
  // Nueva entrada para recibir el número de tareas de hoy
  @Input() tasksToday: number = 0;
}
