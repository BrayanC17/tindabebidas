import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Pedido {
  id?: string;
  productoId: string;
  nombreProducto: string;
  imagenProducto: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  vendedorUid: string;
  nombreNegocio: string;
  compradorUid: string;
  compradorNombre: string;
  fecha: Timestamp;
  estado: 'pendiente' | 'entregado' | 'cancelado';
  metodoPago: string;
  tipoEntrega: 'domicilio' | 'recoger';
  observacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private firestore = inject(Firestore);
  private coleccion = collection(this.firestore, 'pedidos');

  crearPedido(pedido: Omit<Pedido, 'id'>) {
    return addDoc(this.coleccion, pedido);
  }

  obtenerPedidosPorVendedor(uid: string): Observable<Pedido[]> {
    const consulta = query(
      this.coleccion,
      where('vendedorUid', '==', uid),
      orderBy('fecha', 'desc')
    );
    return collectionData(consulta, { idField: 'id' }) as Observable<Pedido[]>;
  }

  obtenerPedidosPorComprador(uid: string): Observable<Pedido[]> {
    const consulta = query(
      this.coleccion,
      where('compradorUid', '==', uid),
      orderBy('fecha', 'desc')
    );
    return collectionData(consulta, { idField: 'id' }) as Observable<Pedido[]>;
  }
}
