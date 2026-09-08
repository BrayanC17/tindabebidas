import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  nameproyecto = signal('tinbebidas');
  description = signal('Proyecto de Angular 17 con Vite y TypeScript 6.0.3');
  autor = signal('Brayan C');
}
