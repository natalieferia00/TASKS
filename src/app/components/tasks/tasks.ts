import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Habit {
  id: number;
  name: string;
  duration: number;
  startDate: Date;
  progress: boolean[];
}

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss']
})
export class HabitsComponent {
  form: FormGroup;
  habits: Habit[] = [];
  editingHabitId: number | null = null;
  registerError: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      duration: [21, [Validators.required, Validators.min(1), Validators.max(365)]]
    });

    // ✅ Cargar hábitos desde localStorage
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      this.habits = JSON.parse(storedHabits);
      this.habits.forEach(h => h.startDate = new Date(h.startDate));
    }
  }

  onSubmit() {
    const name = this.form.value.name.trim();
    const duration = this.form.value.duration;

    if (!name || duration < 1) return;

    if (this.editingHabitId !== null) {
      this.habits = this.habits.map(h =>
        h.id === this.editingHabitId
          ? { ...h, name, duration, progress: new Array(duration).fill(false) }
          : h
      );
      this.editingHabitId = null;
    } else {
      const newHabit: Habit = {
        id: Date.now(),
        name,
        duration,
        startDate: new Date(),
        progress: new Array(duration).fill(false)
      };
      this.habits.push(newHabit);
    }

    this.saveHabitsToStorage();
    this.form.reset({ duration: 21 });
  }

  toggleDayProgress(habit: Habit, index: number) {
    const today = new Date();
    const habitStart = new Date(habit.startDate);
    const allowedDate = new Date(habitStart);
    allowedDate.setDate(habitStart.getDate() + index);

    if (today >= allowedDate) {
      habit.progress[index] = !habit.progress[index];
      this.saveHabitsToStorage();
    }
  }

  getCompletedDays(habit: Habit): number {
    return habit.progress.filter(p => p).length;
  }

  getDayStatus(habit: Habit, index: number): 'completed' | 'missed' | 'pending' {
    const today = new Date();
    const habitStart = new Date(habit.startDate);
    const dayDate = new Date(habitStart);
    dayDate.setDate(habitStart.getDate() + index);

    if (dayDate > today) return 'pending';
    return habit.progress[index] ? 'completed' : 'missed';
  }

  editHabit(habit: Habit) {
    this.form.setValue({
      name: habit.name,
      duration: habit.duration
    });
    this.editingHabitId = habit.id;
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
