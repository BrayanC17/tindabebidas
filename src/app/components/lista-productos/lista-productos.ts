import { Component, inject, input, signal, effect, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProductosService, Producto } from '../../services/productos';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-lista-productos',
  imports: [DecimalPipe],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css'
})
export class ListaProductos {
  private productosService = inject(ProductosService);
  private carritoService = inject(CarritoService);

  // Categoría que llega desde Home (a su vez controlada por el componente Categorias)
  categoria = input<string>('');

  // Alternativa a "categoria": si viene un término de búsqueda, se usa este en vez de la categoría
  terminoBusqueda = input<string>('');

  // Título que se muestra arriba de la cuadrícula, según si es búsqueda o categoría
  titulo = computed(() =>
    this.terminoBusqueda().trim()
      ? `Resultados para "${this.terminoBusqueda()}"`
      : this.categoria()
  );

  productos = signal<Producto[]>([]);
  cargando = signal(true);

  // Feedback visual breve cuando se agrega un producto (id del producto agregado)
  productoRecienAgregado = signal<string | null>(null);

  // Producto sobre el que se hizo clic (para mostrar la ventana de detalle). null = cerrada.
  productoSeleccionado = signal<Producto | null>(null);

  constructor() {
    effect((onCleanup) => {
      const termino = this.terminoBusqueda().trim();
      const categoriaActual = this.categoria();
      this.cargando.set(true);

      const observable = termino
        ? this.productosService.buscarProductosPorNombre(termino)
        : this.productosService.obtenerProductosPorCategoria(categoriaActual);

      const suscripcion = observable.subscribe((productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      });

      onCleanup(() => suscripcion.unsubscribe());
    });
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);

    // Muestra un pequeño "check" en el botón durante un momento
    this.productoRecienAgregado.set(producto.id ?? null);
    setTimeout(() => {
      this.productoRecienAgregado.set(null);
    }, 900);
  }

  abrirDetalle(producto: Producto) {
    this.productoSeleccionado.set(producto);
  }

  cerrarDetalle() {
    this.productoSeleccionado.set(null);
  }

  // Se llama desde el botón dentro del modal: agrega al carrito Y cierra la ventana
  agregarDesdeDetalle(producto: Producto) {
    this.agregarAlCarrito(producto);
    this.cerrarDetalle();
  }
}
