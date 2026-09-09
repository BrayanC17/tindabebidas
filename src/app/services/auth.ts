import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';

export interface DatosUsuario {
  nombre: string;
  correo: string;
  rol: 'cliente' | 'vendedor';
  mayorDeEdad: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  usuarioActual$ = user(this.auth);

  async registrar(datos: DatosUsuario, contrasena: string) {
    // 1. Crear el usuario en Firebase Authentication
    const credencial = await createUserWithEmailAndPassword(
      this.auth,
      datos.correo,
      contrasena
    );

    // 2. Guardar los datos extra (nombre, rol, +18) en Firestore
    const uid = credencial.user.uid;
    await setDoc(doc(this.firestore, 'usuarios', uid), datos);

    return credencial;
  }

  iniciarSesion(correo: string, contrasena: string) {
    return signInWithEmailAndPassword(this.auth, correo, contrasena);
  }

  async obtenerDatosUsuario(uid: string): Promise<DatosUsuario | null> {
    const referencia = doc(this.firestore, 'usuarios', uid);
    const snapshot = await getDoc(referencia);
    return snapshot.exists() ? (snapshot.data() as DatosUsuario) : null;
  }

  cerrarSesion() {
    return signOut(this.auth);
  }
}
