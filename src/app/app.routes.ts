import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Admin } from './pages/admin/admin';
import { Perfil } from './pages/perfil/perfil';
import { Carrito } from './pages/carrito/carrito';
import { Buscar } from './pages/buscar/buscar';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'admin', component: Admin },
  { path: 'perfil', component: Perfil },
  { path: 'carrito', component: Carrito, canActivate: [authGuard] },
  { path: 'buscar', component: Buscar },
];
