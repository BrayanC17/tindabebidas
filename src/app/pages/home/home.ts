import { Component, signal } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Categorias } from '../../components/categorias/categorias';
import { ListaProductos } from '../../components/lista-productos/lista-productos';


@Component({
  imports: [Hero, Categorias, ListaProductos],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})


export class Home {
  categoriaSeleccionada = signal('Cervezas');
}
