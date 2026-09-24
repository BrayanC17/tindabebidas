import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface MetodoPago {
  id?: string;
  tipo: 'tarjeta' | 'efectivo' | 'pse';
  alias: string; // Ej: "Tarjeta terminada en 4242", "Efectivo contra entrega", "PSE"
  numeroEnmascarado?: string; // Solo tarjetas: **** **** **** 4242
  titular?: string; // Solo tarjetas
}

@Injectable({
  providedIn: 'root'
})
export class MetodosPagoService {
  private firestore = inject(Firestore);

  // Cada usuario tiene su propia subcolección de métodos de pago guardados
  private coleccion(uid: string) {
    return collection(this.firestore, `usuarios/${uid}/metodosPago`);
  }

  obtenerMetodosPago(uid: string): Observable<MetodoPago[]> {
    return collectionData(this.coleccion(uid), { idField: 'id' }) as Observable<MetodoPago[]>;
  }

  guardarMetodoPago(uid: string, metodo: Omit<MetodoPago, 'id'>) {
    return addDoc(this.coleccion(uid), metodo);
  }

  eliminarMetodoPago(uid: string, metodoId: string) {
    return deleteDoc(doc(this.firestore, `usuarios/${uid}/metodosPago/${metodoId}`));
  }
}
