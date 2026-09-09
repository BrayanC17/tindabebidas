import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombre = signal('');
  correo = signal('');
  contrasena = signal('');
  confirmarContrasena = signal('');
  rol = signal<'cliente' | 'vendedor'>('cliente');
  mayorDeEdad = signal(false);

  error = signal('');
  cargando = signal(false);

  seleccionarRol(nuevoRol: 'cliente' | 'vendedor') {
    this.rol.set(nuevoRol);
  }

  async registrar() {
    this.error.set('');

    alert('Botón presionado, iniciando registro...');   // 👈 línea temporal de prueba
    this.error.set('');

    if (this.contrasena().length < 6) {
    this.error.set('La contraseña debe tener al menos 6 caracteres');
    return;
  }

    if (this.contrasena() !== this.confirmarContrasena()) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (!this.mayorDeEdad()) {
      this.error.set('Debes confirmar que eres mayor de 18 años');
      return;
    }

    this.cargando.set(true);



    try {
      await this.authService.registrar(
        {
          nombre: this.nombre(),
          correo: this.correo(),
          rol: this.rol(),
          mayorDeEdad: this.mayorDeEdad(),
        },
        this.contrasena()
      );

      // Redirige según el rol elegido
      if (this.rol() === 'vendedor') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (err: any) {
      this.error.set('Error: ' + err.message);
      console.error(err);
    } finally {
      this.cargando.set(false);
    }
  }
}
