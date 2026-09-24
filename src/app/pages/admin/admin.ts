import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { ProductosService, Producto } from '../../services/productos';
import { PedidosService, Pedido } from '../../services/pedidos';
import { AuthService } from '../../services/auth';
import { archivoABase64Comprimido } from '../../utils/imagen';
import { Observable, of } from 'rxjs';
import { CamaraService } from '../../services/camara';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private productosService = inject(ProductosService);
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private camaraService = inject(CamaraService);

  vistaActual = signal<'lista' | 'agregar' | 'ventas'>('lista');
  menuAbierto = signal(false);

  productos$: Observable<Producto[]> = of([]);
  pedidos$: Observable<Pedido[]> = of([]);

  uidActual = signal<string | null>(null);
  nombreNegocioActual = signal<string>('');
  logoNegocioActual = signal<string>('');

  nombre = signal('');
  categoria = signal('Cervezas');
  precio = signal<number | null>(null);
  descripcion = signal('');
  stock = signal<number | null>(null);

  modoImagen = signal<'archivo' | 'url' | 'camara'>('archivo');
  imagenBase64 = signal<string | null>(null);
  imagenUrlTexto = signal('');
  procesandoImagen = signal(false);

  mensaje = signal('');
  cargando = signal(false);
  categorias = ['Cervezas', 'Vinos', 'Aguardiente', 'Ron', 'Whisky', 'Vodka', 'Tequila', 'Cócteles', 'Artesanales', 'Sin Alcohol'];

  ngOnInit() {
    this.authService.usuarioActual$.subscribe(async (usuario) => {
      if (usuario) {
        this.uidActual.set(usuario.uid);
        const datos = await this.authService.obtenerDatosUsuario(usuario.uid);
        this.nombreNegocioActual.set(datos?.nombreNegocio ?? 'Mi negocio');
        this.logoNegocioActual.set(datos?.fotoPerfil ?? '');

        this.productos$ = this.productosService.obtenerProductosPorVendedor(usuario.uid);
        this.pedidos$ = this.pedidosService.obtenerPedidosPorVendedor(usuario.uid);
      }
    });
  }

  cambiarVista(vista: 'lista' | 'agregar' | 'ventas') {
    this.vistaActual.set(vista);
    this.menuAbierto.set(false);
  }

  toggleMenu() {
    this.menuAbierto.set(!this.menuAbierto());
  }

  cambiarModoImagen(modo: 'archivo' | 'url' | 'camara') {
    this.modoImagen.set(modo);
    this.imagenBase64.set(null);
    this.imagenUrlTexto.set('');
  }

  async onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (archivo) {
      this.procesandoImagen.set(true);
      try {
        const base64 = await archivoABase64Comprimido(archivo);
        this.imagenBase64.set(base64);
      } catch (err) {
        this.mensaje.set('No se pudo procesar la imagen');
      } finally {
        this.procesandoImagen.set(false);
      }
    }
  }

  async tomarFotoConCamara() {
    try {
      const base64 = await this.camaraService.tomarFoto();
      this.imagenBase64.set(base64);
    } catch (err) {
      this.mensaje.set('No se pudo acceder a la cámara');
      console.error(err);
    }
  }

  private obtenerImagenFinal(): string {
    if (this.modoImagen() === 'archivo') {
      return this.imagenBase64() ?? '';
    } else {
      return this.imagenUrlTexto();
    }
  }

  async agregarProducto() {
    this.mensaje.set('');

    if (!this.nombre() || !this.precio() || !this.stock()) {
      this.mensaje.set('Completa al menos nombre, precio y stock');
      return;
    }

    if (!this.uidActual()) {
      this.mensaje.set('No se pudo identificar tu sesión');
      return;
    }

    this.cargando.set(true);

    try {
      await this.productosService.agregarProducto({
        nombre: this.nombre(),
        categoria: this.categoria(),
        precio: this.precio()!,
        descripcion: this.descripcion(),
        imagenUrl: this.obtenerImagenFinal(),
        stock: this.stock()!,
        vendedorUid: this.uidActual()!,
        nombreNegocio: this.nombreNegocioActual(),
        logoNegocio: this.logoNegocioActual(),
      });

      this.mensaje.set('¡Producto agregado con éxito!');
      this.limpiarFormulario();
      this.vistaActual.set('lista');
    } catch (err: any) {
      this.mensaje.set('Error al agregar: ' + err.message);
      console.error(err);
    } finally {
      this.cargando.set(false);
    }
  }

  limpiarFormulario() {
    this.nombre.set('');
    this.precio.set(null);
    this.descripcion.set('');
    this.stock.set(null);
    this.imagenBase64.set(null);
    this.imagenUrlTexto.set('');
  }
}
