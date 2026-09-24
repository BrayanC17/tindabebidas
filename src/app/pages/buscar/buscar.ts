import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ListaProductos } from '../../components/lista-productos/lista-productos';

@Component({
  selector: 'app-buscar',
  imports: [ListaProductos, RouterLink],
  templateUrl: './buscar.html',
  styleUrl: './buscar.css'
})
export class Buscar {
  private ruta = inject(ActivatedRoute);

  termino = signal('');

  constructor() {
    this.ruta.queryParamMap.subscribe((params) => {
      this.termino.set(params.get('q') ?? '');
    });
  }
}
