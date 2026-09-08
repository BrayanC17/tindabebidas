import { Component, signal} from '@angular/core';

interface Categoria {
  nombre: string;
  emoji: string;
  color: string;
}

@Component({
  imports: [],
  selector: 'app-categorias',
  styleUrl: './categorias.css',
  templateUrl: './categorias.html',
})

export class Categorias {
 categorias= signal<Categoria[]>([
    { nombre: 'Cervezas', emoji: '🍺', color: '#f4a300' },
    { nombre: 'Vinos', emoji: '🍷', color: '#7b2d3f' },
    { nombre: 'Licores', emoji: '🥃', color: '#8b5a2b' },
    { nombre: 'Sin Alcohol', emoji: '🥤', color: '#2a9d8f' },
    { nombre: 'Artesanales', emoji: '🍻', color: '#e76f51' },
  ]);

  seleccionada = signal<string>('');

  seleccionar(nombre:string) {
    this.seleccionada.set(nombre);
    console.log(`Categoría seleccionada: ${nombre}`);
  }
}
