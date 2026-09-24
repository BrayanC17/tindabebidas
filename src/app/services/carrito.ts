import { Injectable, signal, computed } from '@angular/core';
import { Producto } from './productos';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items = signal<ItemCarrito[]>([]);

  itemsCarrito = this.items.asReadonly();

  cantidadTotal = computed(() =>
    this.items().reduce((total, item) => total + item.cantidad, 0)
  );

  totalPagar = computed(() =>
    this.items().reduce((total, item) => total + item.producto.precio * item.cantidad, 0)
  );

  agregarProducto(producto: Producto, cantidad = 1) {
    const actuales = this.items();
    const existente = actuales.find(item => item.producto.id === producto.id);

    if (existente) {
      this.items.set(
        actuales.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      this.items.set([...actuales, { producto, cantidad }]);
    }
  }

  quitarProducto(productoId: string) {
    this.items.set(this.items().filter(item => item.producto.id !== productoId));
  }

  actualizarCantidad(productoId: string, cantidad: number) {
    if (cantidad <= 0) {
      this.quitarProducto(productoId);
      return;
    }

    this.items.set(
      this.items().map(item =>
        item.producto.id === productoId ? { ...item, cantidad } : item
      )
    );
  }

  vaciarCarrito() {
    this.items.set([]);
  }
}
