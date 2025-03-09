import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService, Appointment } from '../services/appointment.service';

@Component({
  selector: 'app-appointment-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-management.component.html',
  styleUrls: ['./appointment-management.component.css']
})
export class AppointmentManagementComponent implements OnInit {
  private appointmentService = inject(AppointmentService);  // Certifique-se de que está sendo injetado corretamente
  private fb = inject(FormBuilder);

  appointments = signal<Appointment[]>([]);
  appointmentForm!: FormGroup;
  isEditing = signal(false);
  editingAppointmentId: number | null = null;

  ngOnInit(): void {
    this.loadAppointments();
    this.initForm();
  }

  initForm(): void {
    this.appointmentForm = this.fb.group({
      appointmentTypeName: ['', Validators.required],
      userEmail: ['', Validators.required],
      scheduledDateTime: ['', Validators.required]
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => this.appointments.set(data),
      error: (error) => console.error('Erro ao carregar agendamentos:', error)
    });
  }

  saveAppointment(): void {
    if (this.appointmentForm.invalid) {
      console.error('Formulário inválido!', this.appointmentForm.value);
      return;
    }

    const formData = this.appointmentForm.value;

    if (this.isEditing()) {
      this.appointmentService.updateAppointment(this.editingAppointmentId!, formData).subscribe({
        next: () => {
          this.loadAppointments();
          this.resetForm();
        },
        error: (error) => console.error('Erro ao atualizar o agendamento:', error)
      });
    } else {
      this.appointmentService.createAppointment(formData).subscribe({
        next: () => {
          this.loadAppointments();
          this.resetForm();
        },
        error: (error) => console.error('Erro ao criar o agendamento:', error)
      });
    }
  }

  editAppointment(appointment: Appointment): void {
    this.isEditing.set(true);
    this.editingAppointmentId = appointment.id!;
    this.appointmentForm.patchValue(appointment);
  }

  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => this.loadAppointments(),
      error: (error) => console.error('Erro ao excluir o agendamento:', error)
    });
  }

  resetForm(): void {
    this.appointmentForm.reset();
    this.isEditing.set(false);
    this.editingAppointmentId = null;
  }
}
