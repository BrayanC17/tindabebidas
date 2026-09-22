import { Component, signal, inject } from '@angular/core';
import { UbicacionService } from '../../services/ubicacion';

@Component({
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  ubicacionService = inject(UbicacionService);
}
