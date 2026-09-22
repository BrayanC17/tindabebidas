import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  imagenUrl: string;
  stock: number;
  vendedorUid: string;
  nombreNegocio: string;
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
    return collectionData(this.coleccion) as Observable<Producto[]>;
  }

  obtenerProductosPorVendedor(uid: string): Observable<Producto[]> {
    const consulta = query(this.coleccion, where('vendedorUid', '==', uid));
    return collectionData(consulta) as Observable<Producto[]>;
  }
}
