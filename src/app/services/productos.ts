import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  imagenUrl: string;
  stock: number;
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
}
