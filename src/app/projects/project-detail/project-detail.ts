import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Importa el servicio y las interfaces que definen tus modelos de datos
import { ProjectService, Task, Project } from '../../services/project.service';

// Importa el componente de lista de tareas reutilizable que creaste
import { TodoListReusableComponent } from '../../components/todo-list-reusable/todo-list-reusable';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  // Declara el componente reutilizable en el array de imports
  imports: [CommonModule, TodoListReusableComponent],
  template: `
    @if (project) {
      <div class="project-detail-container">
        <h2 class="project-title">Tareas del proyecto: {{ project.name }}</h2>
        <app-todo-list-reusable
          [tasks]="project.tasks"
          (taskAdded)="addTask($event)"
          (taskUpdated)="updateTask($event)"
          (taskDeleted)="deleteTask($event)"
          (taskToggled)="toggleTask($event)">
        </app-todo-list-reusable>
      </div>
    } @else {
      <p>Proyecto no encontrado.</p>
    }
  `,
  styleUrls: ['./project-detail.scss'] // Asegúrate de que el nombre del archivo de estilos sea correcto
})
export class ProjectDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  project: Project | undefined;

  ngOnInit(): void {
    // Suscríbete a los cambios en los parámetros de la URL para obtener el ID del proyecto
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.project = this.projectService.getProjectById(parseInt(projectId, 10));
      }
    });
  }

  /**
   * Maneja el evento de adición de una tarea.
   * Llama al servicio para agregar la tarea y luego recarga el proyecto.
   * @param newTaskData Datos de la nueva tarea (sin id ni estado 'completed').
   */
  addTask(newTaskData: Omit<Task, 'id' | 'completed'>): void {
    if (this.project) {
      this.projectService.addTaskToProject(this.project.id, newTaskData.text);
      this.project = this.projectService.getProjectById(this.project.id);
    }
  }

  /**
   * Maneja el evento de actualización de una tarea.
   * Llama al servicio para actualizar la tarea.
   * @param updatedTask La tarea actualizada.
   */
  updateTask(updatedTask: Task): void {
    if (this.project) {
      this.projectService.updateProjectTask(this.project.id, updatedTask);
    }
  }

  /**
   * Maneja el evento de eliminación de una tarea.
   * Llama al servicio para eliminar la tarea.
   * @param taskId El ID de la tarea a eliminar.
   */
  deleteTask(taskId: number): void {
    if (this.project) {
      this.projectService.deleteProjectTask(this.project.id, taskId);
      this.project = this.projectService.getProjectById(this.project.id);
    }
  }

  /**
   * Maneja el evento de alternar el estado de completado de una tarea.
   * Llama al servicio para actualizar el estado.
   * @param task La tarea cuyo estado se va a alternar.
   */
  toggleTask(task: Task): void {
    if (this.project) {
      this.projectService.toggleTaskCompletion(this.project.id, task.id);
    }
  }
}
