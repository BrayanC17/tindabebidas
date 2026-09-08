import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Categorias } from '../../components/categorias/categorias';

@Component({
  imports: [Hero, Categorias],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
