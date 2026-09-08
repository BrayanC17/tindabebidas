import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  nombre = signal('');
  correo = signal('');
  contrasena = signal('');
  confirmarContrasena = signal('');

  registrar() {
    console.log('registrando usuario:', {
      nombre: this.nombre(),
      correo: this.correo(),
      contrasena: this.contrasena(),
      confirmarContrasena: this.confirmarContrasena()
    });
  }
}
