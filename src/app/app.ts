import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Bebidas } from './components/bebidas/bebidas';

@Component({
  imports: [RouterOutlet, Bebidas],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  nameproyecto = signal('tindabebidas');
  description = signal('Proyecto de Angular 17 con Vite y TypeScript 6.0.3');
  autor = signal('Brayan C');
}
