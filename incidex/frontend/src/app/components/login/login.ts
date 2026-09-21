import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  formulario = this.fb.group({
    usuario: ['', [Validators.required]],
    contrasena: ['', [Validators.required]],
  });

  enviando = signal(false);
  mensajeError = signal('');

  campoInvalido(nombre: string): boolean {
    const control = this.formulario.get(nombre);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.mensajeError.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    const { usuario, contrasena } = this.formulario.value;

    this.authService.login({ usuario: usuario!, contrasena: contrasena! }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.enviando.set(false);
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo iniciar sesion. Intenta nuevamente.');
      },
    });
  }
}
