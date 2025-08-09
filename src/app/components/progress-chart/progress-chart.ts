import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Registra todos los elementos de Chart.js
Chart.register(...registerables);

// Interfaz para las tareas y los hábitos en localStorage
interface Task {
  completed: boolean;
}

interface Habit {
  progress: boolean[];
}

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-chart.html',
  styleUrl: './progress-chart.scss',
})
export class ProgressChartComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Dibujar las gráficas una vez que la vista se ha inicializado
    this.createTaskChart();
    this.createHabitChart();
  } // Carga las tareas desde localStorage

  private loadTasks(): Task[] {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  } // Carga los hábitos desde localStorage

  private loadHabits(): Habit[] {
    const storedHabits = localStorage.getItem('habits');
    return storedHabits ? JSON.parse(storedHabits) : [];
  } // Crea la gráfica de tareas

  private createTaskChart(): void {
    const tasks = this.loadTasks();
    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const incompleteTasks = totalTasks - completedTasks;
    const percentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const canvas: any = document.getElementById('taskChart');
    if (!canvas) {
      return;
    }

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completas', 'Incompletas'],
        datasets: [
          {
            data: [completedTasks, incompleteTasks],
            backgroundColor: ['#a000fe', '#3a3a3a'],
            hoverBackgroundColor: ['#c266ff', '#555555'],
            borderColor: '#1e1e1e', // Establece el color del borde al mismo que el fondo de la tarjeta
            borderWidth: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      },
      plugins: [
        {
          id: 'centerText',
          beforeDraw: (chart: any) => {
            const { ctx } = chart;
            ctx.restore();
            const centerX = chart.getDatasetMeta(0).data[0].x;
            const centerY = chart.getDatasetMeta(0).data[0].y;
            ctx.font = '1.8rem Roboto Script'; // Actualizado para usar la misma fuente que los títulos
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage}%`, centerX, centerY - 10);
            ctx.font = '0.8rem Roboto Script'; // Actualizado para usar la misma fuente que los títulos
            ctx.fillStyle = '#bbb';
            ctx.fillText('Tareas', centerX, centerY + 15);
            ctx.save();
          },
        },
      ],
    });
  } // Crea la gráfica de hábitos

  private createHabitChart(): void {
    const habits = this.loadHabits();
    let completedHabitsDays = 0;
    let totalHabitsDays = 0;
    habits.forEach((habit) => {
      habit.progress.forEach((day) => {
        if (day) {
          completedHabitsDays++;
        }
        totalHabitsDays++;
      });
    });

    const incompleteHabitsDays = totalHabitsDays - completedHabitsDays;
    const percentage =
      totalHabitsDays > 0
        ? Math.round((completedHabitsDays / totalHabitsDays) * 100)
        : 0;

    const canvas: any = document.getElementById('habitChart');
    if (!canvas) {
      return;
    }
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completos', 'Incompletos'],
        datasets: [
          {
            data: [completedHabitsDays, incompleteHabitsDays],
            backgroundColor: ['#3a3a3a', '#ffffffff'],
            hoverBackgroundColor: ['#555555', '#ffffffff'],
            borderColor: '#1e1e1e', // Establece el color del borde al mismo que el fondo de la tarjeta
            borderWidth: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      },
      plugins: [
        {
          id: 'centerText',
          beforeDraw: (chart: any) => {
            const { ctx } = chart;
            ctx.restore();
            const centerX = chart.getDatasetMeta(0).data[0].x;
            const centerY = chart.getDatasetMeta(0).data[0].y;
            ctx.font = '1.8rem Roboto Script'; // Actualizado para usar la misma fuente que los títulos
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage}%`, centerX, centerY - 10);
            ctx.font = '0.8rem Roboto Script'; // Actualizado para usar la misma fuente que los títulos
            ctx.fillStyle = '#bbb';
            ctx.fillText('Hábitos', centerX, centerY + 15);
            ctx.save();
          },
        },
      ],
    });
  }
}
