import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  ciudad = signal('Bogotá');
}
