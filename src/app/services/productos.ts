import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  increment
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

export interface Producto {
  id?: string;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  imagenUrl: string;
  stock: number;
  vendedorUid: string;
  nombreNegocio: string;
  logoNegocio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private firestore = inject(Firestore);
  private coleccion = collection(this.firestore, 'productos');

  agregarProducto(producto: Producto) {
    return addDoc(this.coleccion, producto);
  }

  obtenerProductos(): Observable<Producto[]> {
    return collectionData(this.coleccion, { idField: 'id' }) as Observable<Producto[]>;
  }

  obtenerProductosPorVendedor(uid: string): Observable<Producto[]> {
    const consulta = query(this.coleccion, where('vendedorUid', '==', uid));
    return collectionData(consulta, { idField: 'id' }) as Observable<Producto[]>;
  }

  obtenerProductosPorCategoria(categoria: string): Observable<Producto[]> {
    const consulta = query(this.coleccion, where('categoria', '==', categoria));
    return collectionData(consulta, { idField: 'id' }) as Observable<Producto[]>;
  }

  descontarStock(productoId: string, cantidad: number) {
    const referencia = doc(this.firestore, 'productos', productoId);
    return updateDoc(referencia, {
      stock: increment(-cantidad)
    });
  }

  // Firestore no tiene búsqueda de texto libre; traemos todos los productos
  // y filtramos aquí por nombre. Funciona bien mientras el catálogo no sea enorme.
  buscarProductosPorNombre(termino: string): Observable<Producto[]> {
    const terminoNormalizado = termino.trim().toLowerCase();

    return this.obtenerProductos().pipe(
      map((productos) =>
        productos.filter((p) => p.nombre.toLowerCase().includes(terminoNormalizado))
      )
    );
  }

  // Actualiza cualquier subconjunto de campos de un producto existente
  actualizarProducto(productoId: string, cambios: Partial<Producto>) {
    const referencia = doc(this.firestore, 'productos', productoId);
    return updateDoc(referencia, cambios);
  }

  eliminarProducto(productoId: string) {
    const referencia = doc(this.firestore, 'productos', productoId);
    return deleteDoc(referencia);
  }
}
