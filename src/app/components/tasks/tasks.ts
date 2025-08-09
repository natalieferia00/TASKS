import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Definición de la interfaz Habit con la nueva propiedad 'color'
interface Habit {
  id: number;
  name: string;
  duration: number;
  startDate: Date;
  progress: boolean[];
  color: string; // Nuevo campo para el color del hábito
}

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss']
})
export class HabitsComponent implements OnInit {
  form: FormGroup;
  habits: Habit[] = [];
  editingHabitId: number | null = null;
  registerError: any;
  selectedColor: string = 'purple'; // Color por defecto para los nuevos hábitos

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      duration: [21, [Validators.required, Validators.min(1), Validators.max(365)]]
    });

    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      this.habits = JSON.parse(storedHabits);
      this.habits.forEach(h => {
        h.startDate = new Date(h.startDate);
        // Establecer un color por defecto si no existe (para hábitos antiguos)
        if (!h.color) {
          h.color = 'purple';
        }
      });
    }
  }

  ngOnInit(): void {
    // Lógica de inicialización
  }

  onSubmit() {
    const name = this.form.value.name.trim();
    const duration = this.form.value.duration;

    if (!name || duration < 1) return;

    if (this.editingHabitId !== null) {
      // Si se está editando, actualiza el hábito y mantiene el color existente
      this.habits = this.habits.map(h =>
        h.id === this.editingHabitId
          ? { ...h, name, duration, progress: new Array(duration).fill(false) }
          : h
      );
      this.editingHabitId = null;
    } else {
      // Si es un nuevo hábito, se crea con el color seleccionado
      const newHabit: Habit = {
        id: Date.now(),
        name,
        duration,
        startDate: new Date(),
        progress: new Array(duration).fill(false),
        color: this.selectedColor // Asignar el color seleccionado
      };
      this.habits.push(newHabit);
    }

    this.saveHabitsToStorage();
    this.form.reset({ duration: 21 });
  }

  toggleDayProgress(habit: Habit, index: number) {
    const newProgress = [...habit.progress];
    newProgress[index] = !newProgress[index];

    const updatedHabits = this.habits.map(h =>
      h.id === habit.id ? { ...h, progress: newProgress } : h
    );
    this.habits = updatedHabits;

    this.saveHabitsToStorage();
  }

  getCompletedDays(habit: Habit): number {
    return habit.progress.filter(p => p).length;
  }
  
  getDayStatus(habit: Habit, index: number): 'completed' | 'missed' | 'pending' {
    const today = new Date();
    const habitDay = new Date(habit.startDate);
    habitDay.setDate(habitDay.getDate() + index);

    if (habitDay > today) {
      return 'pending';
    }

    return habit.progress[index] ? 'completed' : 'missed';
  }

  editHabit(habit: Habit) {
    this.form.setValue({
      name: habit.name,
      duration: habit.duration
    });
    this.editingHabitId = habit.id;
    // Establecer el color seleccionado al editar
    this.selectedColor = habit.color;
  }

  deleteHabit(id: number) {
    this.habits = this.habits.filter(h => h.id !== id);
    if (this.editingHabitId === id) this.cancelEdit();
    this.saveHabitsToStorage();
  }

  cancelEdit() {
    this.editingHabitId = null;
    this.form.reset({ duration: 21 });
  }

  private saveHabitsToStorage(): void {
    localStorage.setItem('habits', JSON.stringify(this.habits));
  }
}
