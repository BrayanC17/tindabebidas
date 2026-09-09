import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);

  ciudad = signal('Bogotá');
  busqueda = signal('');
  nombreUsuario = signal<string | null>(null);

  ngOnInit() {
    this.authService.usuarioActual$.subscribe(async (usuario) => {
      if (usuario) {
        const datos = await this.authService.obtenerDatosUsuario(usuario.uid);
        this.nombreUsuario.set(datos?.nombre ?? usuario.email);
      } else {
        this.nombreUsuario.set(null);
      }
    });
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}
