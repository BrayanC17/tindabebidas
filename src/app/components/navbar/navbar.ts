import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from '../../services/auth';
import { UbicacionService } from '../../services/ubicacion';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  ubicacionService = inject(UbicacionService);
  carritoService = inject(CarritoService);

  busqueda = signal('');
  nombreUsuario = signal<string | null>(null);
  rolUsuario = signal<'cliente' | 'vendedor' | null>(null);
  cargandoUbicacion = signal(false);
  fotoPerfilUsuario = signal<string | null>(null);
  menuConfigAbierto = signal(false);

  ngOnInit() {
    this.authService.usuarioActual$.subscribe(async (usuario) => {
      if (usuario) {
        const datos = await this.authService.obtenerDatosUsuario(usuario.uid);
        this.nombreUsuario.set(datos?.nombre ?? usuario.email);
        this.rolUsuario.set(datos?.rol ?? null);
        this.fotoPerfilUsuario.set(datos?.fotoPerfil ?? null);

      } else {
        this.nombreUsuario.set(null);
        this.rolUsuario.set(null);
      }
    });
  }

  async detectarUbicacion() {
    this.cargandoUbicacion.set(true);

    try {
      const posicion = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = posicion.coords;

      const respuesta = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const datos = await respuesta.json();

      const ciudadDetectada =
        datos.address?.city ||
        datos.address?.town ||
        datos.address?.municipality ||
        'Ubicación desconocida';

      const ciudadLimpia = ciudadDetectada
        .replace(/\bciudad\b/gi, '')
        .trim();

      this.ubicacionService.ciudad.set(ciudadLimpia);
    } catch (err) {
      console.error('Error al obtener ubicación:', err);
      alert('No se pudo determinar tu ciudad');
    } finally {
      this.cargandoUbicacion.set(false);
    }

  }

  toggleMenuConfig() {
    this.menuConfigAbierto.set(!this.menuConfigAbierto());
  }

  buscar() {
    const termino = this.busqueda().trim();
    if (!termino) return;

    this.router.navigate(['/buscar'], { queryParams: { q: termino } });
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}
