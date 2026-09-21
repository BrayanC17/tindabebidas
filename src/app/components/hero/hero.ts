import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UbicacionService } from '../../services/ubicacion';

@Component({
  imports: [RouterLink],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  ubicacionService = inject(UbicacionService);
}
