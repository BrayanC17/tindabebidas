import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  correo = signal('');
  contrasena = signal('');
  error = signal('');
  cargando = signal(false);

  async iniciarSesion() {
    this.error.set('');
    this.cargando.set(true);

    try {
      await this.authService.iniciarSesion(this.correo(), this.contrasena());
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error.set('Correo o contraseña incorrectos');
      console.error(err);
    } finally {
      this.cargando.set(false);
    }
  }
}
