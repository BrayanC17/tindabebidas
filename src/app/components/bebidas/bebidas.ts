import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ FormsModule],
  selector: 'app-bebidas',
  styleUrl: './bebidas.css',
  templateUrl: './bebidas.html',
})
export class Bebidas {
  searchTerm: string = '';

  bebidas: string[] = [];


  nuevaBebida: string = '';

  addBebida() {
    if (this.nuevaBebida && this.nuevaBebida.trim()) {
      this.bebidas.push(this.nuevaBebida.trim());
      this.nuevaBebida = '';
    }
  }
}
