import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { CarritoService, ItemCarrito } from '../../services/carrito';
import { ProductosService } from '../../services/productos';
import { PedidosService } from '../../services/pedidos';
import { AuthService } from '../../services/auth';
import { MetodosPagoService, MetodoPago } from '../../services/metodos-pago';

interface GrupoNegocio {
  nombreNegocio: string;
  items: ItemCarrito[];
  subtotal: number;
}

// Controla qué pantalla del modal de checkout se está mostrando
type PasoCheckout = 'cerrado' | 'metodo' | 'nuevaTarjeta' | 'entrega' | 'confirmado';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito {
  carritoService = inject(CarritoService);
  private productosService = inject(ProductosService);
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private metodosPagoService = inject(MetodosPagoService);

  items = computed(() => this.carritoService.itemsCarrito());

  // Agrupa los productos del carrito por negocio, como en la app de referencia
  grupos = computed<GrupoNegocio[]>(() => {
    const mapa = new Map<string, ItemCarrito[]>();

    for (const item of this.items()) {
      const clave = item.producto.nombreNegocio || 'Otros';
      const lista = mapa.get(clave) ?? [];
      lista.push(item);
      mapa.set(clave, lista);
    }

    return Array.from(mapa.entries()).map(([nombreNegocio, items]) => ({
      nombreNegocio,
      items,
      subtotal: items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
    }));
  });

  uidActual = signal<string | null>(null);
  metodosGuardados = signal<MetodoPago[]>([]);

  paso = signal<PasoCheckout>('cerrado');
  metodoSeleccionado = signal<MetodoPago | null>(null);
  procesandoCompra = signal(false);

  // Formulario para agregar una tarjeta nueva
  numeroTarjeta = signal('');
  titularTarjeta = signal('');
  guardarTarjeta = signal(true);

  // Tipo de entrega
  tipoEntrega = signal<'domicilio' | 'recoger'>('domicilio');
  observacion = signal('');

  constructor() {
    this.authService.usuarioActual$.subscribe((usuario) => {
      if (usuario) {
        this.uidActual.set(usuario.uid);
        this.metodosPagoService.obtenerMetodosPago(usuario.uid).subscribe((metodos) => {
          this.metodosGuardados.set(metodos);
        });
      }
    });
  }

  aumentarCantidad(productoId: string, cantidadActual: number) {
    this.carritoService.actualizarCantidad(productoId, cantidadActual + 1);
  }

  disminuirCantidad(productoId: string, cantidadActual: number) {
    this.carritoService.actualizarCantidad(productoId, cantidadActual - 1);
  }

  quitarProducto(productoId: string) {
    this.carritoService.quitarProducto(productoId);
  }

  // ---------------- Flujo del modal de pago ----------------

  abrirModalPago() {
    if (this.items().length === 0) return;
    this.paso.set('metodo');
  }

  cerrarModal() {
    this.paso.set('cerrado');
  }

  volverAMetodos() {
    this.paso.set('metodo');
  }

  elegirMetodoGuardado(metodo: MetodoPago) {
    this.metodoSeleccionado.set(metodo);
    this.paso.set('entrega');
  }

  elegirTipoMetodo(tipo: 'tarjeta' | 'efectivo' | 'pse') {
    if (tipo === 'tarjeta') {
      this.paso.set('nuevaTarjeta');
      return;
    }

    // Efectivo y PSE no necesitan datos adicionales para continuar
    this.metodoSeleccionado.set({
      tipo,
      alias: tipo === 'efectivo' ? 'Efectivo contra entrega' : 'PSE'
    });
    this.paso.set('entrega');
  }

  async confirmarTarjeta() {
    if (!this.numeroTarjeta() || !this.titularTarjeta()) {
      alert('Completa el número de tarjeta y el titular');
      return;
    }

    const ultimos4 = this.numeroTarjeta().slice(-4);
    const metodo: MetodoPago = {
      tipo: 'tarjeta',
      alias: `Tarjeta terminada en ${ultimos4}`,
      numeroEnmascarado: `**** **** **** ${ultimos4}`,
      titular: this.titularTarjeta()
    };

    if (this.guardarTarjeta() && this.uidActual()) {
      await this.metodosPagoService.guardarMetodoPago(this.uidActual()!, metodo);
    }

    this.metodoSeleccionado.set(metodo);
    this.paso.set('entrega');
  }

  async confirmarPedido() {
    if (this.procesandoCompra() || !this.metodoSeleccionado()) return;

    this.procesandoCompra.set(true);

    try {
      const usuario = await firstValueFrom(this.authService.usuarioActual$);
      if (!usuario) {
        alert('Debes iniciar sesión para completar la compra.');
        return;
      }

      const datosComprador = await this.authService.obtenerDatosUsuario(usuario.uid);
      const metodo = this.metodoSeleccionado()!;

      // Un registro de pedido por cada producto comprado (igual que antes, ahora con más datos)
      for (const item of this.items()) {
        if (!item.producto.id) continue;

        await this.productosService.descontarStock(item.producto.id, item.cantidad);

        await this.pedidosService.crearPedido({
          productoId: item.producto.id,
          nombreProducto: item.producto.nombre,
          imagenProducto: item.producto.imagenUrl,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          total: item.producto.precio * item.cantidad,
          vendedorUid: item.producto.vendedorUid,
          nombreNegocio: item.producto.nombreNegocio,
          compradorUid: usuario.uid,
          compradorNombre: datosComprador?.nombre ?? 'Cliente',
          fecha: Timestamp.now(),
          estado: 'pendiente',
          metodoPago: metodo.alias,
          tipoEntrega: this.tipoEntrega(),
          observacion: this.tipoEntrega() === 'recoger' ? this.observacion() : ''
        });
      }

      this.paso.set('confirmado');
      this.carritoService.vaciarCarrito();
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      alert('Ocurrió un error al procesar tu compra. Intenta de nuevo.');
    } finally {
      this.procesandoCompra.set(false);
    }
  }

  cerrarConfirmacion() {
    this.paso.set('cerrado');
    this.metodoSeleccionado.set(null);
    this.numeroTarjeta.set('');
    this.titularTarjeta.set('');
    this.observacion.set('');
    this.tipoEntrega.set('domicilio');
  }
}
