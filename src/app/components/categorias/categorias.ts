import { Component, signal, output, OnInit } from '@angular/core';

interface Categoria {
  nombre: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-categorias',
  imports: [],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {
  categorias = signal<Categoria[]>([
    { nombre: 'Cervezas', icono: 'fa-solid fa-beer-mug-empty', color: '#c9992e' },
    { nombre: 'Vinos', icono: 'fa-solid fa-wine-glass', color: '#5c1a1a' },
    { nombre: 'Aguardiente', icono: 'fa-solid fa-bottle-droplet', color: '#2e1a3d' },
    { nombre: 'Ron', icono: 'fa-solid fa-wine-bottle', color: '#8b5a2b' },
    { nombre: 'Whisky', icono: 'fa-solid fa-whiskey-glass', color: '#4a3728' },
    { nombre: 'Vodka', icono: 'fa-solid fa-martini-glass', color: '#3d5a80' },
    { nombre: 'Tequila', icono: 'fa-solid fa-champagne-glasses', color: '#b5651d' },
    { nombre: 'Cócteles', icono: 'fa-solid fa-martini-glass-citrus', color: '#e76f51' },
    { nombre: 'Artesanales', icono: 'fa-solid fa-mug-saucer', color: '#6b8e4e' },
    { nombre: 'Sin Alcohol', icono: 'fa-solid fa-bottle-water', color: '#2a9d8f' },
  ]);

  seleccionada = signal<string>('');

  // Avisa al componente padre (Home) qué categoría se debe mostrar en la lista de productos
  categoriaElegida = output<string>();

  ngOnInit() {
    // Selecciona la primera categoría por defecto para que la lista no arranque vacía
    this.seleccionar(this.categorias()[0].nombre);
  }

  seleccionar(nombre: string) {
    this.seleccionada.set(nombre);
    this.categoriaElegida.emit(nombre);
  }
}
