import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  correo = signal('');
  contrasena = signal('');

  iniciarSesion() {
   console.log(`conectando ingreso con:`, this.correo(), this.contrasena());
  }
}
