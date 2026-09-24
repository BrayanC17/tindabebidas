import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.usuarioActual$.pipe(
    take(1),
    map((usuario) => {
      if (usuario) {
        return true;
      }

      // No hay sesión iniciada: lo mandamos a login en vez de dejarlo entrar
      router.navigate(['/login']);
      return false;
    })
  );
};
