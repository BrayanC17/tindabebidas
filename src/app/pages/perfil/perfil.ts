import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, DatosUsuario } from '../../services/auth';
import { archivoABase64Comprimido } from '../../utils/imagen';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  uid = signal<string | null>(null);
  rol = signal<'cliente' | 'vendedor' | null>(null);

  nombre = signal('');
  correo = signal('');
  nombreNegocio = signal('');
  nit = signal('');
  fotoPerfil = signal<string | null>(null);

  nuevaContrasena = signal('');
  confirmarNuevaContrasena = signal('');

  procesandoFoto = signal(false);
  mensaje = signal('');
  cargando = signal(false);

  ngOnInit() {
    this.authService.usuarioActual$.subscribe(async (usuario) => {
      if (usuario) {
        this.uid.set(usuario.uid);
        const datos = await this.authService.obtenerDatosUsuario(usuario.uid);

        if (datos) {
          this.nombre.set(datos.nombre);
          this.correo.set(datos.correo);
          this.rol.set(datos.rol);
          this.nombreNegocio.set(datos.nombreNegocio ?? '');
          this.nit.set(datos.nit ?? '');
          this.fotoPerfil.set(datos.fotoPerfil ?? null);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (archivo) {
      this.procesandoFoto.set(true);
      try {
        const base64 = await archivoABase64Comprimido(archivo, 300, 0.7);
        this.fotoPerfil.set(base64);
      } catch (err) {
        this.mensaje.set('No se pudo procesar la imagen');
      } finally {
        this.procesandoFoto.set(false);
      }
    }
  }

  async guardarCambios() {
    this.mensaje.set('');

    if (!this.uid()) return;

    if (this.nuevaContrasena() && this.nuevaContrasena().length < 6) {
      this.mensaje.set('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.nuevaContrasena() !== this.confirmarNuevaContrasena()) {
      this.mensaje.set('Las contraseñas no coinciden');
      return;
    }

    this.cargando.set(true);

    try {
      const datosActualizados: Partial<DatosUsuario> = {
        nombre: this.nombre(),
        fotoPerfil: this.fotoPerfil() ?? '',
      };

      if (this.rol() === 'vendedor') {
        datosActualizados.nombreNegocio = this.nombreNegocio();
        datosActualizados.nit = this.nit();
      }

      await this.authService.actualizarDatosUsuario(this.uid()!, datosActualizados);

      this.mensaje.set('¡Perfil actualizado con éxito!');
    } catch (err: any) {
      this.mensaje.set('Error al actualizar: ' + err.message);
      console.error(err);
    } finally {
      this.cargando.set(false);
    }
  }
}
